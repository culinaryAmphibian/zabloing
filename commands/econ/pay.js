const fs = require('fs');
const search = require('discord.js-search');
const ConfigJSON = require('../../DB/config.json');
const UserJSON = require('../../DB/users.json');
const ServerJSON = require('../../DB/servers.json');

let g_r = ((Math.floor(Math.random() * 50)) + 1);
let g_g = (((Math.floor(Math.random() * 54)) + 1)) + 200;
let g_b = ((Math.floor(Math.random() * 40)) + 40);
greenCol = [g_r,g_g,g_b];

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + Math.floor(Math.random() * 40) + 1;
let o_b = Math.floor(Math.random() * 35) + 1;
let orangeCol = [o_r,o_g,o_b];

let successEmbed = { color: greenCol, title: 'success!', description: '', footer: global.footer };

let errorEmbed = { color: orangeCol, title: 'error', description: '', footer: global.footer };

module.exports =
{
    name: ['pay'], description: `pays a user a certain amount of [curr]`, usage: '[pref]pay <amount of [curr]> <nickname, username, id, or tag>\nexample: [pref]pay 100 jeff#0001',
    async execute(message, args, bot)
    {
        if (message.author.id !== '550886249309929472') return;
        let prefix = ServerJSON[message.guild.id].prefix;
        errorEmbed.description = `please specify an amount of ${ConfigJSON.currency} to transfer`;
        if (!args[1]) return message.channel.send({embed:errorEmbed});
        errorEmbed.description = `please specify a user to pay the ${ConfigJSON.currency} to.`;
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
        errorEmbed.description = `you only have 0 ${ConfigJSON.currency}!`;
        if (UserJSON[message.author.id].games.bal < 1) return message.channel.send({embed:errorEmbed});
        money == 'all' ? money = UserJSON[message.author.id].games.bal : money = parseInt(money);
        let mentioned = message.mentions.members.first();
        let target = 1;
        if (mentioned) target = mentioned;
        else
        {
            let query = args.slice(2).join(" ");
            let x = await(search.searchMember(message, query, true));
            message.channel.send(`are you sure that you want to transfer ${money} ${ConfigJSON.currency} to ${x.user.tag}?`);
            let filter = m => m.author.id === message.author.id && (m.content.includes('n') || m.content.includes('y'));
            let j = await(message.channel.awaitMessages(filter, {max:1}));
            let res = j.first().content;
            if (res.includes('n')) return message.channel.send('transaction cancelled.');
            target = x;
        }
        if (!UserJSON[target.user.id])
        {
            errorEmbed.description = `${target} is a bot and cannot play the game.`;
            if (target.user.bot) return message.channel.send({embed:errorEmbed});
            bot.commandsForInternalProcesses.get('newUser').execute(target.user, message.guild.id);
        }
        errorEmbed.description = 'you don\'t have enough money!';
        if (money > UserJSON[message.author.id].games.bal) return message.channel.send({embed:errorEmbed});
        errorEmbed.description = 'you\'re giving money to yourself!';
        if (target.user.id == message.author.id) return message.channel.send({embed:errorEmbed});
        // success
        UserJSON[message.author.id].games.bal -= money;
        UserJSON[target.user.id].games.bal += money;
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        successEmbed.description = `${money} ${ConfigJSON.currency} have been transferred.`
        successEmbed.fields =
        [
            { name: 'your balance', value: `is now ${UserJSON[message.author.id].games.bal} ${ConfigJSON.currency}`},
            { name: `and ${target.user.username}'s balance`, value: `is now ${UserJSON[target.user.id].games.bal} ${ConfigJSON.currency}`}
        ];
        return message.channel.send({embed:successEmbed});
    }
}