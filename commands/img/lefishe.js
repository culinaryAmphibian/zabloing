const Discord = require('discord.js');
const config = require('../../shhh/config.json');
const Link = config["imageLinks"].lefishe;

module.exports =
{
    name: 'lefishe', description: 'lefisheee',
    execute(message)
    {
        let fisheVid = new Discord.MessageAttachment(Link);
        return message.channel.send(fisheVid);
    }
}