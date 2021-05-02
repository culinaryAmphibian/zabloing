const search = require('discord.js-search');

let r = (Math.floor(Math.random() * 50)) + 1;
let g = (Math.floor(Math.random() * 54)) + 201;
let b = (Math.floor(Math.random() * 40)) + 40;
greenCol = [r,g,b];

let red = ((Math.floor(Math.random() * 5)) * 30) + 100;
let green = (Math.floor(Math.random() * 50)) + 20;
let blue = (Math.floor(Math.random() * 50)) + 20;
global.redCol = [red,green,blue];

let embed = { color: greenCol, title: ``, footer: { text: global.eft, icon_url: global.efi } };
let errorEmbed = { color: redCol, title: `error`, description: '', footer: { text: global.eft, icon_url: global.efi } };

module.exports =
{
    name: 'bal',
    async execute(message, args, UserJSON, bot)
    {
        if (!args[1]) embed.title = `you have ${UserJSON[message.author.id].games.bal} ${global.currency}.`;
        else
        {
            let target;
            let mentioned = message.mentions.members.first();
            if (mentioned) target = mentioned;
            else
            {
                let query = args.slice(1).join(" ");
                let x = await(search.searchMember(message, query, true));
                target = x;
            }
            if (!UserJSON[target.user.id])
            {
                if (target.user.bot)
                {
                    errorEmbed.description = `the found user (${target}) is a bot and cannot play the game.`;
                    return message.channel.send({embed:errorEmbed});
                }
                bot.util.get('newUser').execute(message, target.user, target.user.id);
            }
            embed.title = `${target.user.tag} has ${UserJSON[target.user.id].games.bal} ${global.currency}`;
        }
        return message.channel.send({embed:embed});
    }
}