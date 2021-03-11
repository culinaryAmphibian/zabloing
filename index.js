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
    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;
    if (!message.guild) return;
    var args = message.content.substr(prefix.length).toLowerCase().split(' ');
    switch (args[0])
    {
        case 'hi':
            message.channel.send('helo')
    }
})

bot.login(config.token);