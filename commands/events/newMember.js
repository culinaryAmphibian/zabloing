const Canvas = require('canvas');
const dateFormat = require('dateformat');
const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');
const UserJSON = require('../../DB/users.json');

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

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

function weirdS(num)
{
    if (num == 1) return '';
    else return 's';
}

function yearsDaysMinutes(msDiff)
{
    let seconds = Math.round(msDiff/1000);
    let minutes = Math.floor(seconds/60);
    let hours = Math.floor(minutes/60);
    let days = Math.floor(hours/24);
    let years = Math.floor(days/365);
    if (years > 0)
    {
        if ((days % 365) == 0) return `exactly ${years} (${days}) ago, happy birthday!`;
        return `${years} year${weirdS(years)} (${days} days) ago`;
    } else if (days > 0) return `${days} day${weirdS(days)} (${hours} hours) ago`;
    else if (hours > 0) return `${hours} hour${weirdS(hours)} (${minutes} minutes) ago`;
    else if (minutes > 0) return `${minutes} minute${weirdS(minutes)} (${seconds} seconds) ago`;
    else return `${seconds} second${weirdS(seconds)} (${msDiff} milliseconds) ago`;
}

let embed = {color: blueCol, title: 'welcome, ', description: '', image: {url: ''}, fields: []};

module.exports =
{
    name: 'guildMemberAdd', description: 'what to do when a new member joins', hide: true,
    async execute(bot, member)
    {
        if (!UserJSON[member.user.id]) bot.commandsForInternalProcesses.get('newUser').execute(member.user, member.guild.id);
        if (!UserJSON[member.user.id].servers.includes(member.guild)) UserJSON[member.user.id].servers.push(member.guild.id);
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        embed.title += `${member.user.tag}!`;
        embed.description = `${member} (${member.id}) is the ${ordinal(member.guild.memberCount)} member of this server.`;
        embed.fields.push({name: 'account created:', value: `${yearsDaysMinutes(new Date().getTime() - member.user.createdTimestamp)}`});
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