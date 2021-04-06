const Discord = require('discord.js');

module.exports =
{
    name: 'water', description: 'an attempt to encourage you to get water',
    execute(message, UserJSON)
    {
        if (!UserJSON[message.author.id].lastAsked)
        {
            UserJSON[message.author.id].lastAsked = new Date().getTime();
        }
    }
}