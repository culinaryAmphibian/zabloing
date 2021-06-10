const search = require('discord.js-search');
const ConfigJSON = require('../../DB/config.json');
const UserJSON = require(`../../DB/users.json`);

let g_r = (Math.floor(Math.random() * 50)) + 1;
let g_g = (Math.floor(Math.random() * 54)) + 201;
let g_b = (Math.floor(Math.random() * 40)) + 40;
let greenCol = [g_r,g_g,g_b];

let r_r = (Math.floor(Math.random() * 5) * 30) + 100;
let r_g = Math.floor(Math.random() * 50) + 20;
let r_b = Math.floor(Math.random() * 50) + 20;
let redCol = [r_r,r_g,r_b];

let embed = { color: greenCol, title: ``, footer: global.footer };
let errorEmbed = { color: redCol, title: `error`, description: '', footer: global.footer };

module.exports =
{
    name: ['bal'], description: `checks a user\'s amount of [curr]`, usage: '[pref]bal ?<username, nickname, id, or tag>\nexample: [pref]bal jeff#0001',
    note: 'the optional argument defaults to the message author, which is you.',
    async execute(message, args, bot)
    {
        if (!args[1]) embed.title = `you have ${UserJSON[message.author.id].games.bal} ${ConfigJSON.currency}.`;
        else
        {
            let target;
            let mentioned = message.mentions.members.first();
            if (mentioned) target = mentioned;
            else
            {
                let query = args.slice(1).join(" ");
                target = await(search.searchMember(message, query, true));
            }
            if (!UserJSON[target.user.id])
            {
                if (target.user.bot)
                {
                    errorEmbed.description = `the found user (${target}) is a bot and cannot play the game.`;
                    return message.channel.send({embed:errorEmbed});
                }
                bot.commandsForInternalProcesses.get('newUser').execute(target.user, message.guild.id);
            }
            embed.title = `${target.user.tag} has ${UserJSON[target.user.id].games.bal} ${ConfigJSON.currency}`;
        }
        return message.channel.send({embed:embed});
    }
}