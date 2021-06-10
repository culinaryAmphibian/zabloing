const compare = require('str-compare');
const dateFormat = require('dateformat');
const ms = require('ms');
function greatest(value1, value2)
{
    if (value1 > value2) return value1;
    return value2;
}

function member(query, allMembers)
{
    query = query.trim();
    allMembers.each(m => m.rating = compare.jaro(query, m.user.username));
    allMembers.filter(m => m.nickname).each(m => m.rating = greatest(m.rating, compare.jaro(query, m.nickname)));
    allMembers.sort((a, b) => b.rating - a.rating);
    if (allMembers.first().rating > 0.7) return allMembers.first();
}

async function resolveToMembers(message, args)
{
    args = args.slice(1);

    let target = {roles: [], channels: [], members: []};
    let mentions = message.mentions;
    if (mentions)
    {
        if (mentions.roles) mentions.roles.each(r => target.roles.push(r));
        if (mentions.channels) mentions.channels.each(ch => target.channels.push(ch));
        if (mentions.members) mentions.members.each(m => target.members.push(m));
    }
    args = args.filter(a => !a.match(/<(@!?|@&|#)\d{17,19}>/g));

    let allMembers = await message.guild.members.fetch(true);
    let ids = args.filter(arg => arg.match(/\d{17,19}/g))
    let idCh = ids.filter(id => message.guild.channels.cache.get(id));
    if (idCh) idCh.forEach(id => target.channels.push(message.channels.cache.get(id)));
    args = args.filter(a => !message.guild.channels.cache.get(a));
    let idR = ids.filter(id => message.guild.roles.cache.get(id));
    if (idR) idR.forEach(r => target.roles.push(message.guild.roles.cache.get(r)));
    args = args.filter(a => !message.guild.roles.cache.get(a));
    let idM = ids.filter(id => allMembers.get(id));
    if (idM) idM.forEach(m => target.members.push(allMembers.get(m)));
    args = args.filter(a => !allMembers.get(a));

    args = args.filter(a => !a.match(/\d{17,19}/g));

    let tags = args.filter(a => a.match(/\w{1,32}#\d{4}/g)).filter(allMembers.map(m => m.user.tag).includes(a));
    tags.forEach(tag => target.members.push(allMembers.find(m => m.user.tag == tag)));

    args = args.filter(a => !a.match(/\w{2,32}#\d{4}/g));

    let rNames = args.filter(a => a.startsWith('r:'));
    if (rNames)
    {
        rNames.forEach(name =>
        {
            name = name.slice(2);
            let strict = 1;
            let closestRole;
            while (!closestRole || strict > 0.7)
            {
                closestRole = message.guild.roles.cache.find(r => compare.jaro(name, r.name) > strict);
                strict -= 0.05;
            }
            if (closestRole)
            {
                target.roles.push(closestRole);
                args.splice(args.indexOf(name), 1);
            }
        });
    }

    let final = [];
    target.members.forEach(m => final.push(m));
    target.roles.forEach(r => r.members.each(m => final.push(m)));
    target.channels.forEach(ch => allMembers.filter(m => m.permissionsIn(ch).toArray().includes('SEND_MESSAGES').forEach(m => final.push(m))));

    if (message.content.includes('|')) message.content = message.content.split('|')[0];
    let uArgs = message.content.split(';');
    uArgs.forEach(a =>
    {
        let mem = member(a, allMembers);
        if (mem) final.push(mem);
    });
    return {final: final, target: target};
}

function parseReasonAndTime(message, args)
{
    if (!message.content.includes('|')) return;
    args = message.content.split('|').slice(1);
    if (args) return;
    let time = args.find(a => a.match(/0*[1-9][0-9]*(ms|msecs?|milliseconds?|s|secs?|seconds?|m|mins?|mintutes?|h|hrs?|hours?|d|dys?|days?|w|wks?|weeks?)/gi))
    args = args.filter(a => a != time);
    time = time.split(' ').filter(a => a.match(/^0*[1-9][0-9]*(ms|msecs?|milliseconds?|s|secs?|seconds?|m|mins?|mintutes?|h|hrs?|hours?|d|dys?|days?|w|wks?|weeks?)$/gi));
    let timetime;
    if (time)
    {
        timetime = 0;
        time.forEach(a => timetime += ms(time));
    }
    let reason;
    if (args) reason = args.join(' ');
    return {time: time, reason: reason};
}

function when(ms)
{
    let arr = [];
    let weeks = Math.floor(ms/(1000 * 60 * 60 * 24 * 7));
    if (weeks >= 1) arr.push(`${weeks} weeks`);
    let days = Math.floor((ms - (weeks * (1000 * 60 * 60 * 24 * 7)))/1000 * 60 * 60 * 24);
    if (days >= 1) arr.push(`${days} days`);
    let hours = Math.floor((ms - (days * (1000 * 60 * 60 * 24)))/1000 * 60 * 60);
    if (hours >= 1) arr.push(`${hours} hours`);
    let minutes = Math.floor((ms - (hours * (1000 * 60 * 60)))/(1000 * 60));
    if (minutes >= 1) arr.push(`${minutes} minutes`);
    let seconds = Math.floor((ms - (minutes * (1000 * 60)))/(1000));
    if (seconds >= 1) arr.push(`${seconds} seconds`);
    let millis = Math.floor((ms - (seconds * 1000)));
    if (millis >= 1) arr.push(`${millis} milliseconds`);
    if (arr.length == 1) return `${arr.shift()}`;
    return `${arr.slice(0, -1).join(', ')}, and ${arr.pop()}`;
}

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

let g_r = ((Math.floor(Math.random() * 50)) + 1);
let g_g = (((Math.floor(Math.random() * 54)) + 1)) + 200;
let g_b = ((Math.floor(Math.random() * 40)) + 40);
let greenCol = [g_r,g_g,g_b];

let errEmbed = {color: orangeCol, title: 'error', description: 'i don\'t have the permission to manage roles.', footer: global.footer};
let succEmbed = {color: greenCol, title: 'success', description: '', fields: [], footer: global.footer};

module.exports =
{
    name: ['mute'], description: 'mutes a member to prevent them from sending messages.',
    usage: '[pref]mute ?<role mention, id or its name suffixed with "r:", channel mention, or its id, or user ids> ?<user names, nicknames, or tags, separated by semicolons> | ?<reason that is not a number/time in minutes> | ?<time>\nexample: [pref]mute jeff#0001 3',
    async execute(message, args)
    {
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send({embed:errEmbed});
        errEmbed.description = 'you don\'t have the permission to manage roles.';
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send({embed:errEmbed});
        errEmbed.description = 'please specify a user to mute.';
        if (!args[1]) return message.channel.send({embed:errEmbed});
        let all = await resolveToMembers(message, args);
        let target = all.final;
        errEmbed.description = `i couldn't find those users.`;
        if (!target) return message.channel.send({embed: errEmbed});
        let roleToGive = message.guild.roles.cache.find(r => (r.name.toLowerCase() == 'muted') && (!r.permissions.toArray().includes('SEND_MESSAGES')));
        target.sort((a, b) => b.roles.highest.position - a.roles.highest.position);
        if (!roleToGive) roleToGive = await message.guild.roles.create({data: {name: 'muted', position: bot.roles.highest.position - 1 || target[0].roles.highest.position || 1, permissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'], mentionable: false}, reason: `muting called by ${message.author.tag}.`});
        let options = parseReasonAndTime(message, args);
        let time = options.time;
        let reason = options.reason || 'no reason provided';
        if (reason) target.filter(m => !m.roles.cache.has(roleToGive.id)).forEach(m => m.roles.add(roleToGive, reason));
        succEmbed.description = `${target.length} members have been muted.\nlist:`;
        Object.keys(all.target).forEach(key => succEmbed.fields.push({name: key, value: all.target[key].join(', ')}));
        if (!time) return message.channel.send({succEmbed});
        else
        {
            let limit = 1000 * 60 * 60 * 24 * 7 * 4;
            if (time > limit) time = limit;
            succEmbed.description = `${target.length} members have been muted and will be unmuted in ${when(time)}, at ${dateFormat(new Date().getTime() + time, "dddd, mmmm dd, yyyy h:M:s TT", true)}\nlist:`;
            Object.keys(all.target).forEach(key => succEmbed.fields.push({name: key, value: all.target[key].join(', ')}));
            message.channel.send({embed: succEmbed});
            setTimeout(function() {target.forEach(m => m.roles.remove(roleToGive, 'time was up.'))}, time);
        }
    }
}