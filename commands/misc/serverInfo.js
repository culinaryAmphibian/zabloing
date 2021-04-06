const dateFormat = require('dateformat');

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

// fetchBans.size(), vanity stuff, emojis, roles, 

let region = {'hongkong':'hong kong', 'southafrica': 'south africa', 'us-central': 'central us', 'us-east': 'east us', 'us-south': 'south us', 'us-west': 'east us' };

module.exports =
{
    name: 'serverInfo', description: 'server info',
    async execute(message)
    {
        let icon = message.guild.iconURL({dynamic:true, size: 4096});
            serverRegion = 0;
            if (region[message.guild.region])
            {
                serverRegion = region[message.guild.region];
            } else serverRegion = message.guild.region;
            allMembers = await (message.guild.members.fetch(true));
            nonBotsTotal = allMembers.filter(m => m.user.bot === false);
            dndMembers = nonBotsTotal.filter(m => m.user.presence.status === 'dnd').size;
            offlineMembers = nonBotsTotal.filter(m => m.user.presence.status === 'offline').size;
            onlineMembers = nonBotsTotal.filter(m => m.user.presence.status === 'online').size;
            idleMembers = nonBotsTotal.filter(m => m.user.presence.status === 'idle').size;
            bots = allMembers.filter(m => m.user.bot === true);
            allChannels = message.guild.channels.cache;
            textChannels = allChannels.filter(r => r.type === 'text').size;
            voiceChannels = allChannels.filter(r => r.type === 'voice').size;
            categories = allChannels.filter(r => r.type === 'category').size;
            total = allChannels.size;
            x = Date.now() - message.guild.createdAt;
            h = Math.floor(x / 86400000);
            created = dateFormat(message.guild.createdAt, 'default', true);
            
        let embed =
        {
            color: blueCol, title: `server info for ${message.guild.name} (${message.guild.id})`, thumbnail: {url: icon},
            fields:
            [
                { name: `region`, value: serverRegion}, { name: 'date created', value: `${created} UTC (${h} days ago)`, inline:true}, { name: 'owner', value: `${message.guild.owner.user} (${message.guild.owner.user.id})`, inline:true},
                { name: `${allMembers.size} total members:`, value: `**...........................**`, inline:false},
                { name: `${nonBotsTotal.size} total non-bots`, value: `offline [${offlineMembers}] \n not offline [${allMembers.filter(m => m.user.bot === false).size - offlineMembers}] \n online [${onlineMembers}] \n idle [${idleMembers}] \n do not disturb [${dndMembers}]`, inline:true},
                { name: `${bots.size} total bots`, value: `online[${bots.size - bots.filter(m => m.user.presence.status === 'offline').size}] \n offline [${bots.filter(m => m.user.presence.status === 'offline').size}]`, inline:true},
                { name: `${total} channels (including categories)`, value: `textChannels [${textChannels}] \n  voice channels [${voiceChannels}] \n category channels [${categories}]`, inline: false},
                // { name: ``}
            ], footer: {text:global.eft, iconURL: global.efi}
        };
        return message.channel.send({embed:embed});
    }
}