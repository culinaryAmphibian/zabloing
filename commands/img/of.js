const Discord = require('discord.js');
const config = require('../../shhh/config.json');
const Links = config["imageLinks"];
module.exports =
{
    name: 'of', description: ':flushed:',
    execute(message)
    {
        message.react('😳');
        message.channel.send('onlyfans sent!');
        let of = new Discord.MessageAttachment(Links.of);
        message.author.send(of)
        .catch((err) => { message.channel.send("I can't dm you :("); })
        return;
    }
}