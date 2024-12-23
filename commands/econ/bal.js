const { currency } = require('../../DB/config.json');
const UserJSON = require(`../../DB/users.json`);

module.exports = {
    name: ['bal'], description: `checks a user\'s amount of ${currency}`,
    usage: '[pref]bal ?<username, nickname, id, or tag>\nexample: [pref]bal jeff#0001',
    note: 'displays your balance by default',
    async execute(message, args, bot) {
        const embed = {color: global.green, footer: global.footer};
        const errorEmbed = {title: 'error', color: global.red, footer: global.footer};
        if (!args[1])
            embed.title = `you have ${UserJSON[message.author.id].games.bal} ${currency}.`;
        else {
            let target;
            let mentioned = message.mentions.members.first();
            if (mentioned) target = mentioned;
            else {
                let query = args.slice(1).join(" ");
                target = (await message.guild.members.list())
                            .find((u) => u.nickname.includes(query) || u.user.displayName.includes(query))
                if (!target) {
                    errorEmbed.description = `the user by the name of ${query} could not be found :(`;
                    return message.channel.send({embeds: [errorEmbed]});
                }
            }
            if (!UserJSON[target.user.id]) {
                if (target.user.bot) {
                    errorEmbed.description = `the found user (${target}) is a bot and cannot play the game.`;
                    return message.channel.send({embeds:[errorEmbed]});
                }
                bot.allCommands.get('newUser').execute(target.user, message.guild.id);
            }
            embed.title = `${target.user.tag} has ${UserJSON[target.user.id].games.bal} ${currency}`;
        }
        return message.channel.send({embeds:[embed]});
    }
}