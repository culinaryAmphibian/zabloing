const UserJSON = require('../../DB/users.json');
const dateFormat = require('dateformat');
const search = require('discord.js-search');

const bth = { true: 'yes', false: 'no' };

const flags =
{
	DISCORD_EMPLOYEE: 'discord employee',
	DISCORD_PARTNER: 'discord partner',
	BUGHUNTER_LEVEL_1: 'bug hunter level 1',
	BUGHUNTER_LEVEL_2: 'bug hunter level 2',
	HYPESQUAD_EVENTS: 'hypesquad events',
	HOUSE_BRAVERY: 'house of bravery',
	HOUSE_BRILLIANCE: 'house of brilliance',
	HOUSE_BALANCE: 'house of balance',
	EARLY_SUPPORTER: 'early supporter',
	TEAM_USER: 'team user',
	SYSTEM: 'system',
	VERIFIED_BOT: 'verified bot',
	VERIFIED_DEVELOPER: 'verified bot developer'
};

const perms =
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

const pres = {'dnd': 'do not disturb', 'idle': 'idle', 'offline': 'offline', 'online': 'online'};
const activityType =
{
    PLAYING : 'playing',
    STREAMING: 'streaming',
    LISTENING: 'listening to',
    WATCHING: 'watching',
    COMPETING: 'competing'
};

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

module.exports =
{
    name: ['ui', 'userinfo'], description: 'displays information about a user', usage: '[pref]ui ?<mention, id, nickname, username, tag>\nexample: [pref]ui jeff#0001',
    async execute(message, args)
    {
        let target;
        let mentioned = message.mentions.members.first();
        if (mentioned) target = mentioned.user;
        else if (args[1])
        {
            let j = await(search.searchMember(message, args.slice(1).join(" "), true));
            target = j.user
        }
        else target = message.author;

       let avLink = target.displayAvatarURL({dynamic:true, size: 4096});

       let asGuildMember = message.guild.member(target);

       let topColor = asGuildMember.displayHexColor;
       let nick = '';
       if (asGuildMember.displayName != target.username) nick = `(${asGuildMember.displayName})`;

       let creatednDaysAgo = when( new Date().getTime() - target.createdTimestamp );
       let created = `${dateFormat(target.createdAt, 'default', true)} UTC`;
       finalCreatedDateThingText = `${creatednDaysAgo}\n${created}`;

       let joinednDaysAgo = when( new Date().getTime() - asGuildMember.joinedTimestamp );
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
       if (target.presence.activities[0]) presenceAgo = `, set ${when( new Date().getTime() - target.presence.activities[0].createdTimestamp)}`;

       let boostUsedAgo = when( new Date().getTime() - asGuildMember.premiumSinceTimestamp);

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
       if (lastMessage != undefined) embed.fields.push({ name: 'last message', value: `"${lastMessage.content}", sent ${when(new Date().getTime() - lastMessage.createdTimestamp)} in ${lastMessage.channel}`});
       if (asGuildMember.roles.cache.size > 0) embed.fields.push({ name: 'highest role', value: `${highest}${more}`});
       if (asGuildMember.premiumSinceTimestamp !== 0) embed.fields.push({name: 'boosting this server since', 
            value: `${boostUsedAgo}\n${dateFormat(asGuildMember.premiumSince, 'default', true)} UTC`});
       if (target.presence)
       {
           embed.fields.push({name: 'presence', value: `${presence}${presenceAgo}`});
           (target.presence.activities.filter(a => a.type !== 'CUSTOM_STATUS')
           .forEach(activity => embed.fields[embed.fields.length - 1].value += `\n${activityType[activity.type]} ${activity.name}, set ${when(new Date().getTime() - activity.createdTimestamp)}`));
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
       return message.channel.send({embed:embed});
    }
}