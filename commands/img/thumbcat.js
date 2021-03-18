const Discord = require('discord.js');
const config = require('../../shhh/config.json');
const Link = config["imageLinks"].thumbsUpCat;

module.exports =
{
    name: 'thumbcat', description: 'e',
    execute(message)
    {
        message.react('👍');
        let thumbsUpCat = new Discord.MessageAttachment(Link);
        message.channel.send(thumbsUpCat);
    }
}