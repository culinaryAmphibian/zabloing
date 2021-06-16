const compare = require('str-compare');
const dateFormat = require('dateformat');
const ms = require('ms');

function member(query, allMembers)
{
    query = query.trim();
    allMembers.each(m => m.rating = compare.jaro(query, m.user.username));
    allMembers.filter(m => m.nickname).each(m => m.rating = Math.max(m.rating, compare.jaro(query, m.nickname)));
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

    let tags = args.filter(a => a.match(/\w{1,32}#\d{4}/g)).filter(a => allMembers.map(m => m.user.tag).includes(a));
    tags.forEach(tag => target.members.push(allMembers.find(m => m.user.tag == tag)));

    args = args.filter(a => !a.match(/\w{2,32}#\d{4}/g) && !allMembers.find(m => m.user.tag == a));

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
    target.roles.forEach(r => r.members.each(m => final.push(m)));
    target.channels.forEach(ch => allMembers.filter(m => m.permissionsIn(ch).toArray().includes('SEND_MESSAGES').forEach(m => final.push(m))));

    let uArgs = args;
    if (message.content.includes(';')) uArgs = args.join(' ').split(';');
    uArgs.forEach(a =>
    {
        let mem = member(a, allMembers);
        if (mem)
        {
            args.splice(args.indexOf(`${a}`), 1);
            target.members.push(mem);
        }
    });
    target.members.forEach(m => final.push(m));

    return {final: final, target: target, args: args};
}

function parseReasonAndTime(message, args)
{
    if (!args) return;
    let timeArgs = args.filter(a => a.match(/^0*[1-9][0-9]*(ms|msecs?|milliseconds?|s|secs?|seconds?|m|mins?|mintutes?|h|hrs?|hours?|d|dys?|days?|w|wks?|weeks?)?$/gi));
    timeArgs.forEach(a => args.splice(args.indexOf(a), 1));
    let finalTime = 0;
    if (timeArgs)
    {
        timeArgs.forEach(a =>
        {
            if (!isNaN(a)) a = `${a}m`;
            finalTime += ms(a);
        });
    }
    let reason;
    if (args) reason = args.join(' ');
    return {time: finalTime, reason: reason};
}

function weirdS(num)
{
    if (num != 1) return 's';
    return '';
}

function weirderS(num)
{
    if (num != 1) return 'have';
    return 'has';
}

const yr = 1000 * 60 * 60 * 24 * 365;
const mo = yr/12;
const wk = 1000 * 60 * 60 * 24 * 7;
const dy = wk/7;
const hr = dy/24;
const min = hr/60;
const sec = min/60;
const msec = sec/1000;

function when(ms)
{
    let arr = [];
    let years = Math.floor(ms/yr);
    if (years >= 1) arr.push(`${years} year${weirdS(years)}`);
    ms -= years * yr;
    let months = Math.floor(ms/mo);
    if (months >= 1) arr.push(`${months} month${weirdS(months)}`);
    ms -= months * mo;
    let weeks = Math.floor(ms/wk);
    if (weeks >= 1) arr.push(`${weeks} week${weirdS(weeks)}`);
    ms -= weeks * wk;
    let days = Math.floor(ms/dy);
    if (days >= 1) arr.push(`${days} day${weirdS(days)}`);
    ms -= days * dy;
    let hours = Math.floor(ms/hr);
    if (hours >= 1) arr.push(`${hours} hour${weirdS(hours)}`);
    ms -= hours * hr;
    let minutes = Math.floor(ms/min);
    if (minutes >= 1) arr.push(`${minutes} minute${weirdS(minutes)}`);
    ms -= minutes * min;
    let seconds = Math.floor(ms/sec);
    if (seconds >= 1) arr.push(`${seconds} seconds`);
    ms -= seconds * sec;
    let milliseconds = Math.floor(ms/msec);
    if (milliseconds >= 1) arr.push(`${milliseconds} milliseconds`);

    if (arr.length > 2) return `${arr.slice(0, -1).join(', ')}, and ${arr.pop()}`;
    if (arr.length > 1) return `${arr.slice(0, -1).join(', ')} and ${arr.pop()}`;
    return arr.pop();
}

module.exports =
{
    name: ['mute'], description: 'mutes a member to prevent them from sending messages.',
    usage: '[pref]mute ?<role mention, id or its name suffixed with "r:", channel mention, or its id, or user ids> ?<user names, nicknames, or tags, separated by semicolons> ?<reason that is not a number/time in minutes> ?<time>\nexample: [pref]mute jeff#0001 3',
    async execute(message, args)
    {
        let errEmbed = {color: global.orangeCol, title: 'error', description: 'i don\'t have the permission to manage roles.', footer: global.footer};
        let succEmbed = {color: global.greenCol, title: 'success', description: '', fields: [], footer: global.footer};
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send({embed:errEmbed});
        errEmbed.description = 'you don\'t have the permission to manage roles.';
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send({embed:errEmbed});
        errEmbed.description = 'please specify a user to mute.';
        if (!args[1]) return message.channel.send({embed:errEmbed});
        let all = await resolveToMembers(message, args);
        args = all.args;
        let target = all.target;
        let final = all.final;
        errEmbed.description = `i couldn't find those users.`;
        if (!final[0]) return message.channel.send({embed: errEmbed});
        let roleToGive = message.guild.roles.cache.find(r => (r.name.toLowerCase() == 'muted') && (!r.permissions.toArray().includes('SEND_MESSAGES')));
        final.sort((a, b) => b.roles.highest.position - a.roles.highest.position);
        if (!roleToGive) roleToGive = await message.guild.roles.create({data: {name: 'muted', position: message.guild.me.roles.highest.position - 1 || final[0].roles.highest.position || 1, permissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'], mentionable: false}, reason: `muting called by ${message.author.tag}.`});
        let options = parseReasonAndTime(message, args);
        let time = options.time;
        let reason = options.reason || 'no reason provided';
        if (reason) final.filter(m => !m.roles.cache.has(roleToGive.id)).forEach(m => m.roles.add(roleToGive, reason));
        succEmbed.description = `${final.length} member${weirdS(final.length)} ${weirderS(final.length)} been muted.\nlist:`;
        Object.keys(target).filter(key => target[key][0]).forEach(key => succEmbed.fields.push({name: `${key}`, value: target[key].join(', ')}));
        if (!time) return message.channel.send({embed:succEmbed});
        let limit = 1000 * 60 * 60 * 24 * 7 * 4;
        if (time > limit) time = limit;
        succEmbed.description = `${final.length} member${weirdS(final.length)} ${weirderS(final.length)} been muted.\nthey will be unmuted in ${when(time)}, on ${dateFormat(new Date().getTime() + time, "dddd, mmmm dd, yyyy h:M:s TT", true)}\nlist:`;
        message.channel.send({embed: succEmbed});
        setTimeout(function() {final.forEach(m => m.roles.remove(roleToGive, 'time was up.'))}, time);
    }
}