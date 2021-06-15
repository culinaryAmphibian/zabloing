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

function nick(member)
{
    if (member.nickname) return `${member.nickname} (${member.user.tag}) has left this server.`;
    return `${member.user.tag} has left this server.`;
}

function when(ms)
{
    let arr = [];
    let years = Math.floor(ms/yr);
    if (years >= 1) arr.push(`${years} year${weirdS(years)}`);
    let months = Math.floor((ms - (years * yr))/mo);
    if (months >= 1) arr.push(`${months} month${weirdS(months)}`);
    let weeks = Math.floor((ms - ((years * yr) + (months * mo)))/wk);
    if (weeks >= 1) arr.push(`${weeks} week${weirdS(weeks)}`);
    let days = Math.floor((ms - ((years * yr) + (months * mo) + (weeks * wk)))/dy);
    if (days >= 1) arr.push(`${days} day${weirdS(days)}`);
    let hours = Math.floor((ms - ((years * yr) + (months * mo) + (weeks * wk) + (days * dy)))/hr);
    if (hours >= 1) arr.push(`${hours} hour${weirdS(hours)}`);
    let minutes = Math.floor((ms - ((years * yr) + (months * mo) + (weeks * wk) + (days * dy) + (hours * hr)))/min);
    if (minutes >= 1) arr.push(`${minutes} minute${weirdS(minutes)}`);
    let seconds = Math.floor((ms - ((years * yr) + (months * mo) + (weeks * wk) + (days * dy) + (hours * hr) + (minutes * min)))/sec);
    if (seconds >= 1) arr.push(`${seconds} seconds`);
    let milliseconds = Math.floor((ms - ((years * yr) + (months * mo) + (weeks * wk) + (days * dy) + (hours * hr) + (minutes * min) + (seconds * sec)))/msec);
    if (milliseconds >= 1) arr.push(`${milliseconds} milliseconds`);

    if (arr.length > 2) return `${arr.slice(0, -1).join(', ')}, and ${arr.pop()}`;
    if (arr.length > 1) return `${arr.slice(0, -1).join(', ')} and ${arr.pop()}`;
    return arr.pop();
}

let embed = {color: global.blueCol, title: '', thumbnail: {url: ''}, description: '', fields: [], footer: {text: '', icon_url: ''}};

let acceptableChannelNames = ['leave', 'bye', 'welcome', 'wlc', 'general']

let dateMask = 'dddd, mmmm d yyyy h:M:s tt';

module.exports =
{
    name: 'guildMemberRemove', description: 'what to do when a member leaves', hide: true,
    async execute(bot, member)
    {
        if (member.user.bot) return;
        // there should be a thing that checks if user has been kicked/banned using db
        if (!UserJSON[member.user.id]) bot.commandsForInternalProcesses.get('newUser').execute(member.user, member.guild.id);
        if (!UserJSON[member.user.id].servers.map(s => s.guildId).includes(member.guild.id))
        await bot.commandsForInternalProcesses.get('newServer').execute(member.guild);
        let server = UserJSON[member.user.id].servers.find(s => s.guildId == member.guild.id);
        if (!server) UserJSON[member.user.id].servers.push({guildId: member.guild.id, time: new Date().getTime(), joins: 0, log: [{type: 'leave', time: new Date().getTime()}]});
        else if (!server.log) server.log = [{type: 'leave', time: new Date().getTime()}];
        else server.log.push({type: 'leave', time: new Date().getTime()});
        server.currentlyInThere = false;
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        embed.color = member.displayHexColor || global.blueCol;
        embed.title = nick(member);
        embed.thumbnail.url = member.user.displayAvatarURL({dynamic: true, size: 4096});
        embed.description = `bye, ${member} 😢`;
        embed.fields.push(
            {name: 'they were a member for', value: `${when(new Date().getTime() - member.joinedTimestamp)}\nthey joined on ${dateFormat(member.joinedAt, dateMask, true)} UTC`},
            {name: 'id', value: member.user.id}
        );
        embed.footer = {text: 'alexa, play despacito', icon_url: member.guild.iconURL({dynamic: true})};
        let lastMsg = member.lastMessage;
        if (lastMsg?.content) embed.fields.push({name: 'last message', value: `"${lastMsg.content}", sent at ${dateFormat(lastMsg.createdAt, dateMask, true)} UTC in ${lastMsg.channel}`});
        let channelCache = member.guild.channels.cache;
        let channel = ServerJSON[member.guild.id].leaveChannel || ServerJSON[member.guild.id].welcomeChannel || channelCache.find(c => acceptableChannelNames.includes(c.name)) || channelCache.random();
        if (!channel) return;

        const canvas = Canvas.createCanvas(1050, 450);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgb(116, 117, 116)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(50, 50, 50)';
        let rectOffset = canvas.width/50;
        ctx.fillRect(rectOffset, rectOffset, canvas.width - (rectOffset * 2), canvas.height - (rectOffset * 2));
        ctx.font = placeText(canvas, member.user.tag, canvas.width - (rectOffset * 2) - canvas.width/3 - 10);
        ctx.fillStyle = `rgb(255, 150, 200)`;
        ctx.fillText(member.user.tag, canvas.width/3, canvas.height/1.8);
        ctx.font = placeText(canvas, `goodbye,`, canvas.width - rectOffset - canvas.width/3);
        ctx.fillText(`goodbye,`, canvas.width/3  - 10, canvas.height/4);
        ctx.font = placeText(canvas, `there are now ${member.guild.memberCount} members`, canvas.width - (rectOffset * 2) - 270);
        ctx.fillText(`there are now ${member.guild.memberCount} members.`, canvas.width/3 - 50, canvas.height * 7/8 - 20);
        ctx.font = placeText(canvas, dateFormat(Date.now(), 'fullDate', true), 250);
        ctx.fillText(dateFormat(Date.now(), 'fullDate', true), canvas.width/6 - 128, canvas.height/2 + 180);
        ctx.arc(canvas.width/6, canvas.height/2, 128, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const av = await Canvas.loadImage(member.user.displayAvatarURL({format:'png', size: 256}));
        ctx.drawImage(av, canvas.width/6 - 128, canvas.height/2 - 128, 256, 256);
        
        return channel.send({embed: embed, files: [canvas.toBuffer('image/png')]});
    }
}