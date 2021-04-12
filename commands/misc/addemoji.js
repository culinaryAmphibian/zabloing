module.exports =
{
    name: 'addemoji', description: 'adds an emoji',
    execute(message, args, bot)
    {
        if (message.guild.member(message.author).hasPermission('MANAGE_EMOJI'))
        {
            if (message.guild.member(bot.user).hasPermission('MANAGE_EMOJI'))
            {
                if (args[2])
                {
                    message.guild.emojis.create(args[2], args[1]).then(emoji => message.channel.send(`${emoji}`)).catch((err) => message.channel.send(`${err}`));
                    return;
                } else if (message.attachments.first() && args[1])
                {
                    message.guild.emojis.create(message.attachments.first().attachment, args.slice(1).join("")).then(emoji => message.channel.send(`${emoji}`))
                    .catch(err => message.channel.send(`an error has occurred: ${err}`));
                    return;
                }
            } else return message.channel.send('i don\'t have the perms')
        } else return message.channel.send('you don\'t have the perms!');
    }
}