const fs = require('fs');
const search = require('discord.js-search');
const UserJSON = require('../../DB/users.json');
const ServerJSON = require('../../DB/servers.json');

let r = ((Math.floor(Math.random() * 50)) + 1);
let g = (((Math.floor(Math.random() * 54)) + 1)) + 200;
let b = ((Math.floor(Math.random() * 40)) + 40);
greenCol = [r,g,b];

r = (Math.floor(Math.random() * 25) + 1) + 230;
g = 100 + (Math.floor(Math.random() * 40) + 1);
b = (Math.floor(Math.random() * 35) + 1)
orangeCol = [r,g,b];

let successEmbed = { color: greenCol, title: 'success!', description: '', footer: { text: global.eft, icon_url: global.efi } };

let errorEmbed = { color: orangeCol, title: 'error', description: '', footer: { text: global.eft, icon_url: global.efi } };

module.exports =
{
    name: 'pay', description: 'pays a user some money',
    async execute(message, args, bot)
    {
        if (message.author.id !== '550886249309929472') return;
        let prefix = ServerJSON[message.guild.id].prefix;
        errorEmbed.description = `please specify an amount of ${global.currency} to transfer`;
        if (!args[1]) return message.channel.send({embed:errorEmbed});
        errorEmbed.description = `please specify a user to pay the ${global.currency} to.`;
        if (!args[2]) return message.channel.send({embed:errorEmbed});
        let money = args[1];
        errorEmbed.description = 'please specify a valid amount of money to transfer';
        errorEmbed.fields =
        [
            { name: 'how to use this command', value: `${prefix}pay <positive integer amount> <user>` },
            { name: 'example:', value: `${prefix}pay 5 ${message.guild.owner}`, inline: true },
            { name: 'other info', value: 'the target user parameter accepts a mention, user id, tag, or partial username or nickname', inline: true }
        ];
        if ( ( (isNaN(money)) && (money !== 'all')) || (money.includes(".")) || (money.includes("-")) || (money == 0) )
        return message.channel.send({embed:errorEmbed});
        delete errorEmbed.fields;
        errorEmbed.description = `you only have 0 ${global.currency}!`;
        if (UserJSON[message.author.id].games.bal < 1) return message.channel.send({embed:errorEmbed});
        money == 'all' ? money = UserJSON[message.author.id].games.bal : money = parseInt(money);
        let mentioned = message.mentions.members.first();
        let target = 1;
        if (mentioned) target = mentioned;
        else
        {
            let query = args.slice(2).join(" ");
            let x = await(search.searchMember(message, query, true));
            message.channel.send(`are you sure that you want to transfer ${money} ${global.currency} to ${x.user.tag}?`);
            let filter = m => m.author.id === message.author.id && (m.content.includes('n') || m.content.includes('y'));
            let j = await(message.channel.awaitMessages(filter, {max:1}));
            let res = j.first().content;
            if (res.includes('n')) return message.channel.send('transaction cancelled.');
            target = x;
        }
        if (!UserJSON[target.user.id])
        {
            errorEmbed.description = `that user (${target}) is a bot and cannot play the game.`;
            if (target.user.bot) return message.channel.send({embed:errorEmbed});
            bot.util.get('newUser').execute(message, target.user, target.user.id);
        }
        if (money > UserJSON[message.author.id].games.bal) return message.channel.send('you don\'t have enough money!');
        if (target.user.id == message.author.id) return message.channel.send('you\'re giving money to yourself!');
        // success
        UserJSON[message.author.id].games.bal -= money;
        UserJSON[target.user.id].games.bal += money;
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        successEmbed.description = `${money} ${global.currency} have been transferred.`
        successEmbed.fields =
        [
            { name: 'your balance', value: `is now ${UserJSON[message.author.id].games.bal} ${global.currency}`},
            { name: `and ${target.user.username}'s balance`, value: `is now ${UserJSON[target.user.id].games.bal} ${global.currency}`}
        ];
        return message.channel.send({embed:successEmbed});
    }
}