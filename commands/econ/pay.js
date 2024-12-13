const { writeFileSync } = require('fs');
const { currency } = require('../../DB/config.json');
const UserJSON = require('../../DB/users.json');
const ServerJSON = require('../../DB/servers.json');

module.exports = {
    name: ['pay'], description: `pays a user a certain amount of ${currency}`,
    usage: `[pref]pay <amount of ${currency}> <nickname, username, id, or tag>\nexample: [pref]pay 100 jeff#0001`,
    async execute(message, args, bot) {
        let successEmbed = { color: global.green, title: 'success!', description: '', footer: global.footer };
        let errorEmbed = { color: global.orange, title: 'error', description: '', footer: global.footer };
        let prefix = ServerJSON[message.guild.id].prefix;
        errorEmbed.description = `please specify an amount of ${currency} to transfer`;
        if (!args[1])
            return message.channel.send({embeds:[errorEmbed]});
        errorEmbed.description = `please specify a user to pay the ${currency} to.`;
        if (!args[2])
            return message.channel.send({embeds:[errorEmbed]});
        let money = args[1];
        errorEmbed.description = 'please specify a valid amount of money to transfer';
        errorEmbed.fields =
        [
            { name: 'how to use this command', value: `${prefix}pay <positive integer amount> <user>` },
            { name: 'example:', value: `${prefix}pay 5 ${message.guild.owner}`, inline: true },
            { name: 'other info', value: 'the target user parameter accepts a mention, user id, tag, or partial username or nickname', inline: true }
        ];
        if ( ( (isNaN(money)) && (money !== 'all')) || (money.includes(".")) || (money.includes("-")) || (money == 0) )
            return message.channel.send({embeds:[errorEmbed]});
        errorEmbed.fields = [];
        errorEmbed.description = `you only have 0 ${currency}!`;
        let { bal } = UserJSON[message.author.id].games;
        if (bal < 1)
            return message.channel.send({embeds:[errorEmbed]});
        money == 'all' ? money = bal : money = parseInt(money);
        let mentioned = message.mentions.members.first();
        let target = 1;
        if (mentioned) target = mentioned;
        else {
            let query = args.slice(2).join(" ");
            let x = (await message.guild.members.list())
                    .find((u) => u.nickname.includes(query) || u.user.displayName.includes(query))
            message.channel.send(`are you sure that you want to transfer ${money} ${currency} to ${x.user.tag}?`);
            let filter = m => m.author.id === message.author.id && (m.content.includes('n') || m.content.includes('y'));
            let j = await(message.channel.awaitMessages(filter, {max:1}));
            let res = j.first().content;
            if (res.includes('n'))
                return message.channel.send('transaction cancelled.');
            target = x;
        }
        if (!UserJSON[target.user.id]) {
            errorEmbed.description = `${target} is a bot and cannot play the game.`;
            if (target.user.bot)
                return message.channel.send({embeds:[errorEmbed]});
            bot.allCommands.get('newUser').execute(target.user, message.guild.id);
        }
        errorEmbed.description = 'you don\'t have enough money!';
        if (money > bal)
            return message.channel.send({embeds:[errorEmbed]});
        errorEmbed.description = 'you\'re giving money to yourself!';
        if (target.user.id == message.author.id)
            return message.channel.send({embeds:[errorEmbed]});
        // success
        UserJSON[message.author.id].games.bal -= money;
        UserJSON[target.user.id].games.bal += money;
        writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        successEmbed.description = `${money} ${currency} have been transferred.`
        successEmbed.fields =
        [
            { name: 'your balance', value: `is now ${bal} ${currency}`},
            { name: `and ${target.user.username}'s balance`, value: `is now ${UserJSON[target.user.id].games.bal} ${currency}`}
        ];
        return message.channel.send({embeds:[successEmbed]});
    }
}