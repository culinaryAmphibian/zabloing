const Discord = require('discord.js');
const fs = require('fs');
const config = require('../../shhh/config.json');
const Links = config["imageLinks"];

module.exports =
{
    name: 'sori', description: 'sadcats',
    execute(message)
    {
        message.react('😢');
        let soriVid = new Discord.MessageAttachment(Links.sori);
        message.channel.send(soriVid);
        return;
    }
}