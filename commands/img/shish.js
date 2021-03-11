const Discord = require('discord.js');
const fs = require('fs');
const config = require('../../shhh/config.json');
const Links = config["imageLinks"];
const shish = Links.shish;
let lastIdx = -1;

module.exports =
{
    name: 'shish', description: "shish's cat",
    execute(message, args)
    {
        let num;
        if (args[1])
        {
            if ( ( !isNaN(args[1] ) ) && ( args[1] < (shish.length + 1) ) )
            {
                if (!( (args[1] == 0) || (args[1].includes('-')) || args[1].includes('.') ) )
                {
                    num = args[1] - 1;
                    if (shish[num].endsWith('mp4'))
                    {
                        let vid = new Discord.MessageAttachment(shish[num]);
                        message.channel.send(vid);
                    } else
                    {
                        message.channel.send(shish[num]);
                    }
                    return;
                }
            } else if (args[1] == 'gattina')
            {
                let vid = new Discord.MessageAttachment(shish[1]);
                message.channel.send(vid);
                return;
            } else return message.channel.send('...');
        } else
        {
            num = Math.floor(Math.random() * shish.length);
            while (num == lastIdx)
            {
                num = Math.floor(Math.random() * shish.length);
            }
            lastIdx = num;
            if (shish[num].endsWith('mp4'))
            {
                let vid = new Discord.MessageAttachment(shish[num]);
                message.channel.send(vid);
            } else
            {
                message.channel.send(shish[num]);
            }
            return;
        }
    }
}