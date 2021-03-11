const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const config = require('./shhh/config');
const prefix = '.';

bot.on('ready', () =>
{
    console.log('Online.');
    bot.user.setPresence({ activity: { name: 'aaaaaa' }, status: 'idle' });

});

bot.on('message', async(message) =>
{
    if (message.author.bot) return;
    if (!message.guild) return;
    // w/o prefix
    if (message.content.includes('thankus')) message.channel.send(config.imageLinks.thankus);
    if (message.content.includes('lisa')) message.channel.send(config.imageLinks.lisa);
    if (message.content.includes('birth')) message.channel.send(config.imageLinks.birth);
    if (message.content == 'why') message.channel.send(config.imageLinks.why);
    if (message.content.includes('femboy')) message.channel.send(config.imageLinks.femboy);
    if (message.content.toLowerCase().includes('mad cat drip')) message.channel.send(config.imageLinks.madCatDrip);
    if (message.content.includes('👍'))
    {
        message.react('👍');
        let thumbsUpCat = new Discord.MessageAttachment(config.imageLinks.thumbsUpCat);
        message.channel.send(thumbsUpCat);
    }
    if (!message.content.startsWith(prefix)) return;
    var args = message.content.substr(prefix.length).toLowerCase().split(' ');
    switch (args[0])
    {
        case 'zabloing':
            message.channel.send()
        // zabloing, googas, gronch, lfao, lo, lao/laoo, spong, ganca, birth, lisa, onlyfans, single, shishcat, sessogatto
        // floppa, snowducc, sori, melon, femboy, zingus, gattino
        // chiro, kai, istella, woo, monkimeme
        
    }
})

bot.login(config.token);