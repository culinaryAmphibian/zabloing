module.exports =
{
    name: 'addemoji', description: 'adds an emoji',
    execute(message, args)
    {
        if (message.member.hasPermission('MANAGE_EMOJI'))
        {
            if (message.guild.me.hasPermission('MANAGE_EMOJI'))
            {
                let emojiSrc;
                let emojiTitle;
                if (args[2])
                {
                    if (!args[1].match(/^\w{2,32}$/gi)) return message.channel.send(`the provided name is not allowable`);
                    emojiTitle = args[1];
                    emojiSrc = args[2];
                } else if (message.attachments.first() && args[1])
                {
                    emojiTitle = args.slice(1).join("");
                    if (!emojiTitle.match(/^\w{2,32}$/gi)) return message.channel.send(`the provided name is not allowable`);
                    emojiSrc = message.attachments.first().attachment;
                }
                if (emojiSrc && emojiTitle) return message.guild.emojis.create(args[2], args[1])
                        .then(emoji => message.channel.send(`${emoji}`))
                                .catch((err) => message.channel.send(`${err}`));
            } else return message.channel.send('i don\'t have the perms')
        } else return message.channel.send('you don\'t have the perms!');
    }
}