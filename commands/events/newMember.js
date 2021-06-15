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

const permsDict =
{
    ADMINISTRATOR: 'admin',
    CREATE_INSTANT_INVITE: 'create invites',
    KICK_MEMBERS: 'kick members',
    BAN_MEMBERS: 'ban members',
    MANAGE_CHANNELS: 'edit and reorder channels',
    MANAGE_GUILD: 'edit the guild information, region, etc.',
    ADD_REACTIONS: 'add new reactions to messages',
    VIEW_AUDIT_LOG: 'view audit log',
    PRIORITY_SPEAKER: 'priority speaker',
    STREAM: 'stream into vc',
    VIEW_CHANNEL: 'view channels',
    SEND_MESSAGES: 'send messages',
    SEND_TTS_MESSAGES: 'send tts messages',
    MANAGE_MESSAGES: 'delete messages and reactions',
    EMBED_LINKS: 'embed links',
    ATTACH_FILES: 'attach files',
    READ_MESSAGE_HISTORY: 'view past messages',
    MENTION_EVERYONE: 'mention everyone',
    USE_EXTERNAL_EMOJIS: 'use external emojis',
    VIEW_GUILD_INSIGHTS: 'view guild insights',
    CONNECT: 'connect to a voice channel',
    SPEAK: 'speak in a voice channel',
    MUTE_MEMBERS: 'mute members',
    DEAFEN_MEMBERS: 'deafen members',
    MOVE_MEMBERS: 'move members between voice channels',
    USE_VAD: 'use voice activity detection',
    CHANGE_NICKNAME: 'change nickname',
    MANAGE_NICKNAMES: 'change other members\' nicknames',
    MANAGE_ROLES: 'manage roles',
    MANAGE_WEBHOOKS: 'manage webhooks',
    MANAGE_EMOJIS: 'manage emojis'
};

function ordinal(num)
{
    let ord = `${num}`;
    num = parseInt(ord.split(' ').pop());
    switch(num)
    {
        case 1:
            ord += 'st';
            break;
        case 2:
            ord += 'nd';
            break;
        case 3:
            ord += 'rd';
            break;
        default:
            ord += 'th';
    }
    return ord;
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
    if (seconds >= 1) arr.push(`${seconds} second${weirdS(seconds)}`);
    let milliseconds = Math.floor((ms - ((years * yr) + (months * mo) + (weeks * wk) + (days * dy) + (hours * hr) + (minutes * min) + (seconds * sec)))/msec);
    if (milliseconds >= 1) arr.push(`${milliseconds} millisecond${weirdS(milliseconds)}`);

    if (arr.length > 2) return `${arr.slice(0, -1).join(', ')}, and ${arr.pop()} ago`;
    if (arr.length > 1) return `${arr.slice(0, -1).join(', ')} and ${arr.pop()} ago`;
    return arr.pop() + ' ago';
}

let embed = {color: global.blueCol, title: 'welcome, ', description: '', thumbnail: {url: ''}, fields: []};

module.exports =
{
    name: 'guildMemberAdd', description: 'what to do when a new member joins', hide: true,
    async execute(bot, member)
    {
        if (!member.user.bot)
        {
            if (!UserJSON[member.user.id]) bot.commandsForInternalProcesses.get('newUser').execute(member.user, member.guild.id);
            if (!UserJSON[member.user.id].servers.map(s => s?.guildId).includes(member.guild.id)) UserJSON[member.user.id].servers.push({guildId: member.guild.id, time: new Date().getTime(), joins: 0});
            UserJSON[member.user.id].servers.find(s => s.guildId == member.guild.id).currentlyInThere = true;
            UserJSON[member.user.id].servers.find(s => s.guildId == member.guild.id).joins++;
            fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        }
        embed.title += `${member.user.tag}!`;
        embed.thumbnail.url = member.user.displayAvatarURL({dynamic: true, size: 4096})
        embed.description = `${member} is the ${ordinal(member.guild.memberCount)} member of this server.`;
        embed.fields.push( {name: 'id', value: member.id}, {name: 'account created:', value: `${when(new Date().getTime() - member.user.createdTimestamp)}`});
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
        ctx.font = placeText(canvas, `welcome to ${member.guild.name},`, canvas.width - rectOffset - canvas.width/3);
        ctx.fillText(`welcome to ${member.guild.name},`, canvas.width/3  - 10, canvas.height/4);
        ctx.font = placeText(canvas, `you are the ${ordinal(member.guild.memberCount)} member.`, canvas.width - (rectOffset * 2) - 250);
        ctx.fillText(`you are the ${ordinal(member.guild.memberCount)} member.`, canvas.width/3 - 50, canvas.height * 7/8 - 20);
        ctx.font = placeText(canvas, dateFormat(Date.now(), 'fullDate', true), 250);
        ctx.fillText(dateFormat(Date.now(), 'fullDate', true), canvas.width/6 - 128, canvas.height/2 + 180);
        ctx.arc(canvas.width/6, canvas.height/2, 128, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const av = await Canvas.loadImage(member.user.displayAvatarURL({format:'png', size: 256}));
        ctx.drawImage(av, canvas.width/6 - 128, canvas.height/2 - 128, 256, 256);
        const channels = member.guild.channels.cache;
        const channel = channels.get(ServerJSON[member.guild.id]?.welcomeChannel) || channels.find(c => c.name.includes('welcome') || c.name.includes('wlc') || c.name.includes('general')) || channels.random();
        if (!member.user.bot)
        {
            channel.send({embed: embed});
            return channel.send({files:[canvas.toBuffer('image/png')]});
        }
        embed.title = `${member.user.tag} has joined the server.`;
        embed.description = `${member} (${member.user.id}) is a bot.`;
        let perms = member.permissions.toArray();
        if (perms)
        {
            let permsStr;
            perms.slice(0, -1).forEach(p => permsStr += `${permsDict[p]}, `);
            permsStr += `and ${permsDict[perms.pop()]}`;
            if (permsStr.startsWith('undefined')) permsStr = permsStr.slice('undefined'.length);
            embed.fields.push({name: `${member.user.username} has permissions to:`, value: permsStr});
        }
        return channel.send({embed: embed});
    }
}