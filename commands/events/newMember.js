const Canvas = require('canvas');
const dateFormat = require('dateformat');
const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');
const UserJSON = require('../../DB/users.json');
const when = require('../util/when');
const permsDict = require('../../DB/config.json').permsDictionary;

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

module.exports =
{
    name: 'guildMemberAdd', description: 'what to do when a new member joins', hide: true,
    async execute(bot, member)
    {
        let embed = {color: global.blueCol, title: 'welcome, ', description: '', thumbnail: {url: ''}, fields: []};
        if (!member.user.bot)
        {
            if (!UserJSON[member.user.id]) bot.commandsForInternalProcesses.get('newUser').execute(member.user, member.guild.id);
            let serverJoined = UserJSON[member.user.id].servers.find(s => s?.guildId == member.guild.id);
            if (!serverJoined) UserJSON[member.user.id].servers.push({guildId: member.guild.id, time: new Date().getTime(), log: [], joins: 0});
            serverJoined.log.push({type: 'join', time: new Date().getTime()});
            serverJoined.currentlyInThere = true;
            serverJoined.joins++;
            fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
            if (member.guild.me.hasPermission('MANAGE_ROLES')) member.roles.add(serverJoined.roles.filter(r => member.guild.roles.cache.has(r)));
        }
        embed.title += `${member.user.tag}!`;
        embed.thumbnail.url = member.user.displayAvatarURL({dynamic: true, size: 4096})
        embed.description = `${member} is the ${ordinal(member.guild.memberCount)} member of this server.`;
        embed.fields.push( {name: 'id', value: member.id}, {name: 'account created:', value: `${when(new Date().getTime() - member.user.createdTimestamp, true)}`});
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
        const channels = member.guild.channels.cache.filter(ch => ch.type == 'text');
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