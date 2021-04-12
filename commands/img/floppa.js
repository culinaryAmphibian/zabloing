const config = require('../../DB/config.json');
const Links = config["imageLinks"].floppa;
let lastIdx = -1;

module.exports =
{
    name: 'floppa', description: "gregory",
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
                        message.channel.send({files:[{attachment:Links[num], name: num}]});
                    } else
                    {
                        message.channel.send(Links[num]);
                    }
                    return;
                }
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
                message.channel.send({files:[{attachment:Links[num], name: num}]});
            } else
            {
                message.channel.send(Links[num]);
            }
            return;
        }
    }
}