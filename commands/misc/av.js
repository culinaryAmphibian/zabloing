let errEmbed = {color: global.orange, title: 'error', description: 'sorry, i could not find that user.', footer: global.footer};

module.exports =
{
    name : ['av', 'avatar', 'pfp'], description: 'fetches a user\'s profile picture', usage: '[pref]av ?<mention, tag, id, user, or nickname>\nexample: [pref]av jeff#0001',
    note: 'the optional parameter defaults to the message author, which is you.',
    async execute(message, args)
    {
        var embed = { color: global.blue, title: ``, url: ``, image: { url: `` }, footer: global.footer };
        let target;
        let mentioned = message.mentions.members.first();
        if (!args[1]) target = message.author;
        else
        {
            if (mentioned) target = mentioned.user;
            else if (args[1])
            {
                let query = args.slice(1).join(" ");
                let x = (await message.guild.members.list()).find((u) => u.nickname.includes(query) || u.user.displayName.includes(query))
                if (x == undefined) return message.channel.send({embeds:[errEmbed]});
                target = x.user;
            }
        }
        embed.image.url = target.displayAvatarURL({ dynamic: true, size: 4096 });
        embed.title = `${target.username}'s avatar`;
        embed.url = target.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' });
        return message.channel.send({embeds:[embed]});
    }
}