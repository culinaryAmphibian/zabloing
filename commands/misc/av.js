let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

const { searchMember } = require('discord.js-search');

module.exports =
{
    name : 'av', description: 'fetches profile pictures',
    async execute(message, args)
    {
        var embed = { color: blueCol, title: ``, url: ``, image: { url: `` }, footer: { text: global.eft, icon_url: global.efi } };
        let target;
        let mentioned = message.mentions.members.first();
        if (!args[1]) target = message.author;
        else
        {
            if (mentioned) target = mentioned.user;
            else if (args[1])
            {
                let query = args.slice(1).join(" ");
                let x = await(searchMember(message, query, true));
                if (x == undefined) return message.channel.send('sorry, i could not find this user.');
                target = x.user;
            }
        }
        embed.image.url = target.displayAvatarURL({ dynamic: true, size: 4096 });
        embed.title = `${target.username}'s avatar`;
        embed.url = target.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' });
        return message.channel.send({embed:embed});
    }
}