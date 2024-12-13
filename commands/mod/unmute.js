const compare = require('str-compare');

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

    return {final: final, target: target};
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

let errEmbed = {color: global.orange, title: 'error', description: 'i don\'t have the permission to manage roles.', footer: global.footer};
let succEmbed = {color: global.green, title: 'success', description: '', fields: [], footer: global.footer};

module.exports =
{
    name: ['unmute'],
    description: 'unmutes members of a server, meant to be used for mass unmutes.', hide: true,
    usage: '[pref]unmute ?<channel mention or id, role mention, id, or its name prefixed with "r:", user mention, id, tag> ?<usernames or nicknames separated by semicolons> | ?<reason>',
    async execute(message, args)
    {
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send({embeds:[errEmbed]});
        errEmbed.description = 'you don\'t have the permission to manage roles.';
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send({embeds:[errEmbed]});
        errEmbed.description = 'please specify a user to mute.';
        if (!args[1]) return message.channel.send({embeds:[errEmbed]});
        let all = await resolveToMembers(message, args);
        let final = all.final;
        let target = all.target;
        errEmbed.description = `i couldn't find those users.`;
        if (!final) return message.channel.send({embeds: [errEmbed]});
        let roleToRemove = message.guild.roles.cache.find(r => r.name.toLowerCase() == 'muted' && !r.permissions.toArray().includes('SEND_MESSAGES'));
        errEmbed.description = 'there is no muted role in this server!';
        if (!roleToRemove) return message.channel.send({embeds: [errEmbed]});
        let reason = message.content.slice(1).shift() || 'no reason provided';
        final.filter(m => m.roles.cache.has(roleToRemove.id)).forEach(m => m.roles.remove(roleToRemove, reason));
        succEmbed.description = `${final.length} member${weirdS(final.length)} ${weirderS(final.length)} been unmuted.`;
        Object.keys(target).filter(t => t[0]).forEach(t => succEmbed.fields.push({name: t, value: all.target[t].join(', ')}));
        return message.channel.send({embeds: [succEmbed]});
    }
}