const Discord = require('discord.js');
const config = require('../../shhh/config.json');
const Link = config["imageLinks"].woo;

module.exports =
{
    name: 'woo', description: "yeah baby that's what i've been waiting for that's what it's all about wooooooooooooooooo",
    execute(message)
    {
        let vid = new Discord.MessageAttachment(Link);
        message.channel.send(vid);
        return;
    }
}