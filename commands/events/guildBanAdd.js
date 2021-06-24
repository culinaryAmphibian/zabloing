const Canvas = require('canvas');
const dateFormat = require('dateformat');
const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');
const UserJSON = require('../../DB/users.json');

function placeText(canvas, text, width)
{
    const ctx = canvas.getContext('2d');
    let fontSize = 70;
    ctx.font = `${fontSize}px sans-serif`;
    while(ctx.measureText(text).width > width)
    {
        ctx.font = `${fontSize -= 5}px sans-serif`;
    }
    return ctx.font;
}

const yr = 1000 * 60 * 60 * 24 * 365;
const mo = yr/12;
const wk = 1000 * 60 * 60 * 24 * 7;
const dy = wk/7;
const hr = dy/24;
const min = hr/60;
const sec = min/60;
const msec = sec/1000;

function weirdS(num)
{
    if (num != 1) return 's';
    return '';
}

function when(ms)
{
    let arr = [];
    let years = Math.floor(ms/yr);
    if (years >= 1) arr.push(`${years} year${weirdS(years)}`);
    ms -= years * yr;
    let months = Math.floor(ms/mo);
    if (months >= 1) arr.push(`${months} month${weirdS(months)}`);
    ms -= months * mo;
    let weeks = Math.floor(ms/wk);
    if (weeks >= 1) arr.push(`${weeks} week${weirdS(weeks)}`);
    ms -= weeks * wk;
    let days = Math.floor(ms/dy);
    if (days >= 1) arr.push(`${days} day${weirdS(days)}`);
    ms -= days * dy;
    let hours = Math.floor(ms/hr);
    if (hours >= 1) arr.push(`${hours} hour${weirdS(hours)}`);
    ms -= hours * hr;
    let minutes = Math.floor(ms/min);
    if (minutes >= 1) arr.push(`${minutes} minute${weirdS(minutes)}`);
    ms -= minutes * min;
    let seconds = Math.floor(ms/sec);
    if (seconds >= 1) arr.push(`${seconds} seconds`);
    ms -= seconds * sec;
    let milliseconds = Math.floor(ms/msec);
    if (milliseconds >= 1) arr.push(`${milliseconds} milliseconds`);

    if (arr.length > 2) return `${arr.slice(0, -1).join(', ')}, and ${arr.pop()}`;
    if (arr.length > 1) return `${arr.slice(0, -1).join(', ')} and ${arr.pop()}`;
    return arr.pop();
}

let embed = {color: global.orangeCol, title: '', thumbnail: {url: ''}, description: '', fields: [], footer: {text: '', icon_url: ''}};

let dateMask = 'dddd, mmmm d yyyy h:M:s tt';

let acceptableChannelNames = ['leave', 'bye', 'welcome', 'wlc', 'general']

module.exports =
{
    name: 'guildBanAdd', hide: true,
    async execute(bot, guild, user)
    {
        if (guild.me.hasPermission('VIEW_AUDIT_LOG')) return;
        if (!user.bot && !UserJSON[user.id]) await bot.commandsForInternalProcesses.get('newUser').execute(user, guild.id);
        let serverLeft = UserJSON[user.id]?.servers?.find(s => s?.guildId == guild.id);
        if (!serverLeft?.log) serverLeft.log = [];
        serverLeft?.log.push({type: 'leave:ban', time: new Date().getTime()});
        serverLeft.currentlyInThere = false;
        if (!serverLeft?.leaves) serverLeft.leaves = 0;
        serverLeft.leaves++;
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        embed.color = global.orangeCol;
        embed.title = `${user.tag} has been banned.`;
        let toptext = 'goodbye,';
        embed.thumbnail.url = user.displayAvatarURL({dynamic: true, size: 4096});
        embed.fields.push({name: 'date & time', value: dateFormat(new Date().getTime(), dateMask, true)}, {name: 'kicked user id', value: user.id});
        let joined = serverLeft.log?.filter(e => e.type.startsWith('join')).pop().time
        if (joined) embed.fields.push({name: 'they were a member for:', value: `${when(new Date().getTime() - joined)}\nthey joined on ${dateFormat(joined, dateMask, true)}`});
        embed.footer.icon_url = guild.iconURL({dynamic: true});
        embed.footer.text = `shaking and crying rn`;
        let channelCache = guild.channels.cache.filter(ch => ch.type == 'text');
        let channel = channelCache.get(ServerJSON[guild.id].leaveChannel) || channelCache.get(ServerJSON[guild.id].welcomeChannel) || channelCache.find(c => acceptableChannelNames.includes(c.name)) || channelCache.random();
        if (!channel) return;

        const canvas = Canvas.createCanvas(1050, 450);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgb(116, 117, 116)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(50, 50, 50)';
        let rectOffset = canvas.width/50;
        ctx.fillRect(rectOffset, rectOffset, canvas.width - (rectOffset * 2), canvas.height - (rectOffset * 2));

        ctx.font = placeText(canvas, user.tag, canvas.width - (rectOffset * 2) - canvas.width/3 - 10);
        ctx.fillStyle = `rgb(255, 150, 200)`;
        ctx.fillText(user.tag, canvas.width/3, canvas.height/1.8);
        ctx.font = placeText(canvas, toptext, canvas.width - rectOffset - canvas.width/3);
        ctx.fillText(toptext, canvas.width/3  - 10, canvas.height/4);
    
        ctx.font = placeText(canvas, `there are now ${guild.memberCount} members`, canvas.width - (rectOffset * 2) - 270);
        ctx.fillText(`there are now ${guild.memberCount} members.`, canvas.width/3 - 50, canvas.height * 7/8 - 20);
        ctx.font = placeText(canvas, dateFormat(Date.now(), 'fullDate', true), 250);
        ctx.fillText(dateFormat(Date.now(), 'fullDate', true), canvas.width/6 - 128, canvas.height/2 + 180);
        ctx.arc(canvas.width/6, canvas.height/2, 128, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const av = await Canvas.loadImage(user.displayAvatarURL({format:'png', size: 256}));
        ctx.drawImage(av, canvas.width/6 - 128, canvas.height/2 - 128, 256, 256);
        
        return channel.send({embed: embed, files: [canvas.toBuffer('image/png')]});
    }
}