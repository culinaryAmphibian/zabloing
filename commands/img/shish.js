const Discord = require('discord.js');
const config = require('../../shhh/config.json');
const Links = config["imageLinks"].shish;
let lastIdx = -1;

module.exports =
{
    name: 'shish', description: "shish's cat",
    execute(message, args)
    {
        let num;
        if (args[1])
        {
            if ( ( !isNaN(args[1] ) ) && ( args[1] <= Links.length ) )
            {
                if (!( (args[1] == 0) || (args[1].includes('-')) || args[1].includes('.') ) )
                {
                    num = args[1] - 1;
                    if (Links[num].endsWith('mp4'))
                    {
                        let vid = new Discord.MessageAttachment(Links[num]);
                        message.channel.send(vid);
                    } else
                    {
                        message.channel.send(Links[num]);
                    }
                    return;
                }
            } else if (args[1] == 'gattina')
            {
                let vid = new Discord.MessageAttachment(Links[1]);
                message.channel.send(vid);
                return;
            } else return message.channel.send('...');
        } else
        {
            num = Math.floor(Math.random() * Links.length);
            while (num == lastIdx)
            {
                num = Math.floor(Math.random() * Links.length);
            }
            lastIdx = num;
            if (Links[num].endsWith('mp4'))
            {
                let vid = new Discord.MessageAttachment(Links[num]);
                message.channel.send(vid);
            } else
            {
                message.channel.send(Links[num]);
            }
            return;
        }
    }
}