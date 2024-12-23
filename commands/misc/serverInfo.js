const dateFormat = import('dateformat');
const when = require('../util/when');

let bTN = { undefined: 0 };
let region = {'hongkong':'hong kong', 'southafrica': 'south africa', 'us-central': 'central us', 'us-east': 'east us', 'us-south': 'south us', 'us-west': 'west us' };

module.exports =
{
    name: ['serverinfo'], description: 'displays info about the server',
    async execute(message)
    {
        let icon = message.guild.iconURL({dynamic:true, size: 4096});

        let serverRegion;
        if (region[message.guild.region]) serverRegion = region[message.guild.region];
        else serverRegion = message.guild.region;

        let allMembers = await (message.guild.members.fetch(true));
        let nonBotsTotal = allMembers.filter(m => m.user.bot === false);
        let dndMembers = nonBotsTotal.filter(m => m.user.presence.status === 'dnd').size;
        let offlineMembers = nonBotsTotal.filter(m => m.user.presence.status === 'offline').size;
        let notOfflineMembers = allMembers.filter(m => !m.user.bot).size - offlineMembers;
        let onlineMembers = nonBotsTotal.filter(m => m.user.presence.status === 'online').size;
        let idleMembers = nonBotsTotal.filter(m => m.user.presence.status === 'idle').size;
        let bots = allMembers.filter(m => m.user.bot === true);
        let offlineBots = bots.filter(b => b.user.presence.status === 'offline');
        let onlineBots = bots.size - offlineBots.size;

        let allChannels = message.guild.channels.cache;
        let textChannels = allChannels.filter(r => r.type === 'text').size;
        let voiceChannels = allChannels.filter(r => r.type === 'voice').size;
        let categories = allChannels.filter(r => r.type === 'category').size;
        
        let total = allChannels.size;
        let h = Date.now() - message.guild.createdAt;
        let created = dateFormat(message.guild.createdAt, 'default', true);

        let allRoles = message.guild.roles.cache;
        let rolesYes = allRoles.array().sort( (a, b) => b.position - a.position );
        let rolesStrToAddAtTheEnd;
        if (allRoles.size > 10)
        {
            rolesYes = rolesYes.slice(0, 10);
            strToAddAtTheEnd = `and ${allRoles.size - 10} more...`
        }
        let rolesStr = '';
        rolesYes.forEach(r => rolesStr += `${r}\n`);
        if (rolesStrToAddAtTheEnd) rolesStr = rolesStr + rolesStrToAddAtTheEnd;

        let allEmojis = message.guild.emojis.cache;
        let animatedEmojis = allEmojis.filter(e => e.animated).size;
        if (animatedEmojis == 0) animatedEmojis = 'none'
        let emojiYes = allEmojis.array().sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        let emojiStrToAddAtTheEnd;
        if (emojiYes.length > 25)
        {
            emojiYes = emojiYes.slice(0, 25);
            emojiStrToAddAtTheEnd = `and ${allEmojis.size - 25} more...`;
        }
        let emojisStr = '';
        let counter = 0;
        emojiYes.forEach(e =>
        {
            counter++;
            if (counter > (Math.round(Math.sqrt(emojiYes.length)) + 1))
            {
                emojisStr += `\n`;
                counter = 0;
            }
            emojisStr += ` ${e}`
        });
        if (emojiStrToAddAtTheEnd) emojisStr = `${emojisStr}\n${emojiStrToAddAtTheEnd}`;

        let bans = await(message.guild.fetchBans());
        bansYes = bans.array();
        let bansStrToAddAtTheEnd = '';
        if (bansYes.length > 10)
        {
            bansYes = bans.slice(0, 10);
            bansStrToAddAtTheEnd = `and ${bans.size - 10} more...`;
        }
        let bansStr = '';
        bansYes.forEach(b =>
        {
            bansStr += `${b.user.tag}\n`
        })
        bansStr = bansStr + bansStrToAddAtTheEnd;
        let invites = await(message.guild.fetchInvites());
            
        let embed =
        {
            color: global.blue, title: `server info for ${message.guild.name}`, thumbnail: {url: icon},
            fields:
            [
                { name: `region`, value: serverRegion, inline: true},
                { name: 'id', value: message.guild.id, inline: true },
                { name: 'date created', value: `${when(h, true)}\n${created} UTC`, inline: false},
                { name: 'owner', value: `${message.guild.owner.user}\n(${message.guild.owner.user.id})`, inline:true},
                { name: 'invites', value: `${invites.size} active invites`, inline: true},
                { name: `${allMembers.size} total members:`, value: `**.............................**`, inline:false},
                { name: `${nonBotsTotal.size} total non-bots`,
                    value: `offline [${offlineMembers}]\nnot offline [${notOfflineMembers}]\nonline [${onlineMembers}]\nidle[${idleMembers}]\ndo not disturb [${dndMembers}]`, inline:true },
                { name: `${bots.size} total bots`, value: `online[${onlineBots}] \n offline [${offlineBots.size}]`, inline:true},
                { name: 'bans', value: `${bans.size} bans:\n${bansStr}`, inline: true },
                { name: `${total} channels (including categories)`, value: `text channels [${textChannels}] \n  voice channels [${voiceChannels}] \n category channels [${categories}]`, inline: false},
            ], footer: global.footer
        };

        if (allRoles.size > 0) embed.fields.push({name: `${allRoles.size} total roles`, value: `roles in order of highest to lowest:\n${rolesStr}`, inline: true});
        if (allRoles.size > 0) embed.fields.push({name: `${allEmojis.size} total emojis, ${animatedEmojis} of which are animated`, value: emojisStr, inline: true});
        if (message.guild.premiumTier) embed.fields.push({name: `boosts`, value: `tier ${message.guild.premiumTier}, ${message.guild.premiumSubscriptionCount} boosts`});

        return message.channel.send({embeds:[embed]});
    }
}