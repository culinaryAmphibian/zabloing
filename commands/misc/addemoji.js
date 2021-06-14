let errEmbed = {color: global.orangeCol, title: 'error', description: '', footer: global.footer};

module.exports =
{
    name: ['addemoji'], description: 'creates an emoji', usage: '[pref]addemoji <emoji name> <https link or attachment>\nexample: [pref]addemoji helo https://cdn.discordapp.com/attachments/816879899024556045/846560937317236816/squar.png',
    execute(message, args)
    {
        errEmbed.description = 'you don\'t have the perms!';
        if (!message.member.hasPermission('MANAGE_EMOJI')) return message.channel.send({embed:errEmbed});
        errEmbed.description = 'i don\'t have the perms';
        if (!message.guild.me.hasPermission('MANAGE_EMOJI')) return message.channel.send({embed:errEmbed});
        let emojiSrc;
        let emojiTitle;
        errEmbed.description = 'please provide a name for the emoji';
        if (!args[1]) return message.channel.send({embed:errEmbed});
        if (args[2])
        {
            errEmbed.description = 'the provided name is not allowable';
            if (!args[1].match(/\w{2,32}/gi)) return message.channel.send({embed:errEmbed});
            emojiTitle = args[1];
            emojiSrc = args[2];
        } else if (message.attachments.first() && args[1])
        {
            emojiTitle = args.slice(1).join("_");
            errEmbed.description = 'the provided name is not allowable';
            if (!emojiTitle.match(/^\w{2,32}$/gi)) return message.channel.send({embed:errEmbed});
            emojiSrc = message.attachments.first().attachment;
        }
        if (emojiSrc && emojiTitle) return message.guild.emojis.create(args[2], args[1])
                .then(emoji => message.channel.send(`${emoji}`))
                        .catch((err) => message.channel.send(`${err}`));
    }
}