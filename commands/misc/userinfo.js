const UserJSON = require('../../DB/users.json');
const dateFormat = import('dateformat');
const ConfigJSON = require('../../DB/config.json');
const perms = ConfigJSON.permsDictionary;
const flags = ConfigJSON.flags;
const when = require('../util/when');

const bth = { true: 'yes', false: 'no' };

const pres = {'dnd': 'do not disturb', 'idle': 'idle', 'offline': 'offline', 'online': 'online'};
const activityType =
{
    PLAYING : 'playing',
    STREAMING: 'streaming',
    LISTENING: 'listening to',
    WATCHING: 'watching',
    COMPETING: 'competing'
};

module.exports =
{
    name: ['ui', 'userinfo'], description: 'displays information about a user', usage: '[pref]ui ?<mention, id, nickname, username, tag>\nexample: [pref]ui jeff#0001',
    async execute(message, args)
    {
        let target;
        let mentioned = message.mentions.members.first();
        if (mentioned) target = mentioned.user;
        else if (args[1])
            target = (await message.guild.members.list()).find((u) => u.nickname.includes(query) || u.user.displayName.includes(query)).user;
        else target = message.author;

       let avLink = target.displayAvatarURL({dynamic:true, size: 4096});

       let asGuildMember = message.guild.member(target);

       let topColor = asGuildMember.displayHexColor;
       let nick = '';
       if (asGuildMember.displayName != target.username) nick = `(${asGuildMember.displayName})`;

       let creatednDaysAgo = when( new Date().getTime() - target.createdTimestamp , true );
       let created = `${dateFormat(target.createdAt, 'default', true)} UTC`;
       finalCreatedDateThingText = `${creatednDaysAgo}\n${created}`;

       let joinednDaysAgo = when( new Date().getTime() - asGuildMember.joinedTimestamp , true );
       let joined = `${dateFormat(asGuildMember.joinedAt, 'default', true)} UTC`;
       finalJoiendDateThingText = `${joinednDaysAgo}\n${joined}`;

       let lastMessage = await(asGuildMember.fetch(true));
       lastMessage = lastMessage.lastMessage;
       if (lastMessage != null)
       {
          let lastMessageChannel = asGuildMember.lastMessage.channel;
          if (lastMessageChannel) if (message.guild.member(message.author).permissionsIn(lastMessageChannel).has('VIEW_CHANNEL')) lastMessage = lastMessage;
       } else lastMessage = undefined;

       let presence = `${pres[target.presence.status]}`;
       let presenceAgo = '';
       if (target.presence.activities[0]) presenceAgo = `, set ${when( new Date().getTime() - target.presence.activities[0].createdTimestamp, true)}`;

       let boostUsedAgo = when( new Date().getTime() - asGuildMember.premiumSinceTimestamp, true);

       let highest = `${asGuildMember.roles.highest}, ${asGuildMember.roles.highest.position} from the bottom\nand ${message.guild.roles.cache.size - asGuildMember.roles.highest.position} from the top`;
       let more = asGuildMember.roles.cache.size;
       more > 2 ? more = ` and ${more - 2} other role${weirdS(more - 2)}` : more = '';

       let embed =
       {
           color: topColor, title: `${target.tag} ${nick}`, description: `${target}`, thumbnail: { url: avLink },
           fields: [{name: 'id', value: target.id}, { name: 'created', value: finalCreatedDateThingText }, { name: `joined`, value: finalJoiendDateThingText },
                    {name: 'can i kick them? can i ban them? can i manage them otherwise?', 
                    value: `${bth[asGuildMember.bannable]}, ${bth[asGuildMember.kickable]}, and ${bth[asGuildMember.manageable]}`}]
       };
       if (lastMessage != undefined) embed.fields.push({ name: 'last message', value: `"${lastMessage.content}", sent ${when(new Date().getTime() - lastMessage.createdTimestamp, true)} in ${lastMessage.channel}`});
       if (asGuildMember.roles.cache.size > 0) embed.fields.push({ name: 'highest role', value: `${highest}${more}`});
       if (asGuildMember.premiumSinceTimestamp !== 0) embed.fields.push({name: 'boosting this server since', 
            value: `${boostUsedAgo}\n${dateFormat(asGuildMember.premiumSince, 'default', true)} UTC`});
       if (target.presence)
       {
           embed.fields.push({name: 'presence', value: `${presence}${presenceAgo}`});
           (target.presence.activities.filter(a => a.type !== 'CUSTOM_STATUS')
           .forEach(activity => embed.fields[embed.fields.length - 1].value += `\n${activityType[activity.type]} ${activity.name}, set ${when(new Date().getTime() - activity.createdTimestamp, true)}`));
       }
       let flagsVal;
       if (target.flags.toArray().length > 0)
       {
           let flagsStr = '';
           target.flags.toArray().forEach(f => flagsStr += `${flags[f]}\n`);
           flagsVal = flagsStr;
       } else flagsVal = 'none';
       embed.fields.push({ name: 'flags', value: flagsVal});
       let permsVal;
       if (asGuildMember.permissions.toArray().length > 0)
       {
           let permsStr = '';
           let counter = 0;
           asGuildMember.permissions.toArray().forEach(p => 
            {
                if (counter == (Math.round(Math.sqrt(asGuildMember.permissions.toArray().length) + 1)))
                {
                    permsStr += `\n`;
                    counter = 0;
                }
               permsStr += `${perms[p]}, `
            });
           permsVal = permsStr.slice(0, -2);
       } else permsVal = 'none';
       embed.fields.push({ name: 'permissions in this server', value: permsVal});
       if (target.bot) embed.description += `(this user is a bot)`;

       if (asGuildMember.voice.channel) embed.fields.push(
        {
           name: 'voice state', 
           value: `deafened: ${asGuildMember.voice.deaf}\nmuted:${asGuildMember.voice.mute}\nstreaming: ${bth[asGuildMember.voice.streaming]}\nstreaming video: ${asGuildMember.voice.selfVideo}`
        });
        if ( (UserJSON[target.id]) && (UserJSON[target.id].name.length > 1))
        {
            let prevNameStr = '';
            UserJSON[target.id].name.slice(0, -1).forEach(n => prevNameStr += `${n}\n`);
            embed.fields.splice(3, 0, { name: 'previous names', value: prevNameStr});
        }
       return message.channel.send({embeds:[embed]});
    }
}