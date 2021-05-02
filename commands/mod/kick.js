const search = require('discord.js-search');

function kick(x, message, args, bot)
{
    let member = message.guild.member(x);
    if (!member) return message.channel.send('who\'s that?');
    if (member.id == message.author.id) return message.channel.send('don\'t kick yourself!');
    if (member.id == bot.user.id) return message.channel.send('rude 🥲');
    let reason = args.slice(2).join(" ");
    if (!reason) reason = 'no reason provided';
    return member.kick(reason).then(() => message.channel.send(`successfully kicked ${member.user.tag} (${member.id})`))
    .catch((err) => message.channel.send(`oops, there was an error: ${err}`));
}

function ban(x, message, args, bot)
{
    let member = message.guild.member(x);
    if (!member) return message.channel.send('who\'s that?');
    if (member.id == message.author.id) return message.channel.send('don\'t ban yourself!');
    if (member.id == bot.user.id) return message.channel.send('rude 🥲');
    let reason = args.slice(2).join(" ");
    if (!reason) reason = 'no reason provided';
    return member.ban({reason:reason}).then(() => message.channel.send(`successfully kicked ${member.user.tag} (${member.id})`))
    .catch((err) => message.channel.send(`oops, there was an error: ${err}`));
}

module.exports =
{
    name: 'kickban', description: 'kicks a user from a server',
    async execute(message, args, bot)
    {
        switch(args[0])
        {
            case 'kick':    
                if ((message.guild.me.hasPermission("KICK_MEMBERS")) || (message.guild.me.hasPermission('ADMINISTRATOR')))
                {
                    if ( (message.member.hasPermission("KICK_MEMBERS")) || (message.member.hasPermission('ADMINISTRATOR')))
                    {
                        let mentioned = message.mentions.members.first();
                        if (mentioned)
                        {
                            return kick(mentioned, message, args, bot);
                        } else if (args[1])
                        {
                            let query = args.slice(1).join(" ");
                            let x = await(search.searchMember(message, query, true));
                            // confirmation
                            return kick(x, message, args, bot);
                        } else return message.channel.send('who do you want me to kick?');
                    } else return message.channel.send('you don\'t have the perms lol');
                } else return message.channel.send('i don\'t have the perms 🥲');
            case 'ban':
                if ((message.guild.me.hasPermission("KICK_MEMBERS")) || (message.guild.me.hasPermission('ADMINISTRATOR')))
                {
                    if ( (message.member.hasPermission("KICK_MEMBERS")) || (message.member.hasPermission('ADMINISTRATOR')))
                    {
                        let mentioned = message.mentions.members.first();
                        if (mentioned)
                        {
                            return kick(mentioned, message, args, bot);
                        } else if (args[1])
                        {
                            let query = args.slice(1).join(" ");
                            let x = async (search.searchMember(message, query, true));
                            return ban(x, message, args, bot);
                        } else return message.channel.send('who do you want me to ban?');
                    } else return message.channel.send('you don\'t have the perms lol');
                } else return message.channel.send('i don\'t have the perms 🥲');                
        }
    }
}