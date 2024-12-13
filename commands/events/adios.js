const Canvas = require('canvas');
const dateFormat = import('dateformat');
const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');
const UserJSON = require('../../DB/users.json');
const when = require('../util/when');

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

function nick(member)
{
    if (member.nickname) return `${member.nickname} (${member.user.tag}) has left this server.`;
    return `${member.user.tag} has left this server.`;
}

let acceptableChannelNames = ['leave', 'bye', 'welcome', 'wlc', 'general']

let dateMask = 'dddd, mmmm d yyyy h:M:s tt';

module.exports =
{
    name: 'guildMemberRemove', description: 'what to do when a member leaves', hide: true,
    async execute(bot, member)
    {
        let fakeServer = {}
        if (!UserJSON[member.user.id]) await bot.allCommands.get('newUser').execute(member.user, member.guild.id);
        if (!UserJSON[member.user.id]?.servers.map(s => s?.guildId).includes(member.guild.id))
            UserJSON[member.user.id]?.servers.push({guildId: member.guild.id, time: new Date().getTime(), log: [], currentlyInThere: false});
        let server = UserJSON[member.user.id]?.servers.find(s => s.guildId == member.guild.id) || fakeServer;
        if (!server?.log) server.log = [];
        server.currentlyInThere = false;
        server.log.push({type: 'leave', time: new Date().getTime()});
        server.roles = [];
        member.roles.cache.each(r => server.roles.push(r.id));

        let channelCache = member.guild.channels.cache.filter(ch => ch.type == 'text');
        let channel = channelCache.get(ServerJSON[member.guild.id].leaveChannel) || channelCache.get(ServerJSON[member.guild.id].welcomeChannel) || channelCache.find(c => acceptableChannelNames.includes(c.name)) || channelCache.random();
        if (!channel) return;

        let embed = {color: global.blue, title: '', thumbnail: {url: ''}, description: '', fields: [], footer: {text: '', icon_url: ''}};
        embed.color = member.displayHexColor || global.orange;
        embed.title = nick(member);
        embed.description = `bye, ${member} 😢`;
        embed.thumbnail.url = member.user.displayAvatarURL({dynamic: true, size: 4096});
        embed.footer = {text: 'alexa, play despacito', icon_url: member.guild.iconURL({dynamic: true})};
        let topPictureText = `goodbye,`;

        if (member.guild.me.hasPermission('VIEW_AUDIT_LOG'))
        {
            let allLogs = await member.guild.fetchAuditLogs({limit: 3});
            allLogs = allLogs.entries.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter(e => e.target.id == member.id).first();
            let reason = allLogs?.reason;
            let action = allLogs?.action;
            switch (action)
            {
                case 'MEMBER_KICK':
                    server.log[server.log.length - 1].type += ':kick';
                    embed.title = `${member.user.tag} has been kicked from this server`;
                    embed.description = `${member.guild.member(allLogs.executor)} has kicked ${member}`;
                    embed.footer.text = `shacking and criing rn`;
                    topPictureText = `${allLogs.executor.tag} has kicked`;
                    break;
                case 'MEMBER_PRUNE':
                    server.log[server.log.length - 1].type += ':prune'
                    embed.title = `${member.user.tag} has been removed from this server due to pruning`;
                    embed.description = `${member.guild.member(allLogs.executor)} has pruned ${member}`;
                    embed.footer.text = `they will be missed... (or not)`;
                    topPictureText = `${allLogs.executor.tag} has pruned`;
                    break;
                case 'MEMBER_BAN_ADD':
                    server.log[server.log.length - 1].type += ':ban';
                    embed.title = `${member.user.tag} has been banned.`;
                    embed.description = `${member} has been banned by ${member.guild.member(allLogs.executor)}`;
                    let banInfo = await member.guild.fetchBan(member.user);
                    if (banInfo.reason) reason = banInfo.reason;
                    embed.footer.text = 'rip in peace'
                    topPictureText = `${allLogs.executor.tag} has banned`;
                    break;
            }
            if (reason) embed.fields.push({name: 'reason', value: `"${reason}"`});
            if (allLogs.extra) embed.fields.push({name: 'extra info', value: allLogs.extra});
        }
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        embed.fields.push(
            {name: 'they were a member for', value: `${when(new Date().getTime() - member.joinedTimestamp)}\nthey joined on ${dateFormat(member.joinedAt, dateMask, true)} UTC`},
            {name: 'id', value: member.user.id}
        );
        let lastMsg = member.lastMessage;
        if (lastMsg?.content) embed.fields.push({name: 'last message', value: `"${lastMsg.content}",\nsent at ${dateFormat(lastMsg.createdAt, dateMask, true)} in ${lastMsg.channel}`});

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
        ctx.font = placeText(canvas, topPictureText, canvas.width - rectOffset - canvas.width/3);
        ctx.fillText(topPictureText, canvas.width/3  - 10, canvas.height/4);
        ctx.font = placeText(canvas, `there are now ${member.guild.memberCount} members`, canvas.width - (rectOffset * 2) - 270);
        ctx.fillText(`there are now ${member.guild.memberCount} members.`, canvas.width/3 - 50, canvas.height * 7/8 - 20);
        ctx.font = placeText(canvas, dateFormat(Date.now(), 'fullDate', true), 250);
        ctx.fillText(dateFormat(Date.now(), 'fullDate', true), canvas.width/6 - 128, canvas.height/2 + 180);
        ctx.arc(canvas.width/6, canvas.height/2, 128, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const av = await Canvas.loadImage(member.user.displayAvatarURL({format:'png', size: 256}));
        ctx.drawImage(av, canvas.width/6 - 128, canvas.height/2 - 128, 256, 256);
        
        return channel.send({embeds: [embed], files: [canvas.toBuffer('image/png')]});
    }
}