const { searchMember } = require('discord.js-search');

let b_r = Math.floor(Math.random() * 50);
let b_g = Math.floor(Math.random() * 100) + 50;
let b_b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [b_r,b_g,b_b];

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

let errEmbed = {color: orangeCol, title: 'error', description: 'sorry, i could not find that user.', footer: global.footer};

module.exports =
{
    name : ['av', 'avatar', 'pfp'], description: 'fetches a user\'s profile picture', usage: '[pref]av ?<mention, tag, id, user, or nickname>\nexample: [pref]av jeff#0001',
    note: 'the optional parameter defaults to the message author, which is you.',
    async execute(message, args)
    {
        var embed = { color: blueCol, title: ``, url: ``, image: { url: `` }, footer: global.footer };
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
                if (x == undefined) return message.channel.send({embed:errEmbed});
                target = x.user;
            }
        }
        embed.image.url = target.displayAvatarURL({ dynamic: true, size: 4096 });
        embed.title = `${target.username}'s avatar`;
        embed.url = target.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' });
        return message.channel.send({embed:embed});
    }
}