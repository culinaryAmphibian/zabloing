module.exports =
{
    name: 'addemoji', description: 'adds an emoji',
    execute(message, args, bot)
    { if (message.guild.member(message.author).hasPermission('MANAGE_EMOJI') && message.guild.member(bot.user).hasPermission('MANAGE_EMOJI'))
        if (args[2])
        {
            message.guild.emojis.create(args[2], args[1]).then(emoji => message.channel.send(`${emoji}`)).catch(console.error);
            return;
        } else if (message.attachments.first() && args[1])
        {
            message.guild.emojis.create(message.attachments.first().attachment, args[1]).then(emoji => message.channel.send(`${emoji}`)).catch(console.error);
            return;
        } else
        {
            return;
        }
    }
}