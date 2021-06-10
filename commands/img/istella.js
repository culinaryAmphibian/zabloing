const config = require('../../DB/config.json');
const Links = config["imageLinks"].istella;
let lastIdx = -1;

module.exports =
{
    name: ['istella'], description: "samoona's friend's cat",
    execute(message, args)
    {
        let num;
        if (args[1])
        {
            if ( ( !isNaN(args[1] ) ) && ( args[1] <= Links.length ) )
            {
                if (!( (args[1] == 0) || (args[1].includes('-')) || args[1].includes('.') ) ) return message.channel.send(Links[num]);
            } else return message.channel.send('...');
        } else
        {
            num = Math.floor(Math.random() * Links.length);
            while (num == lastIdx)
            {
                num = Math.floor(Math.random() * Links.length);
            }
            lastIdx = num;
            message.channel.send(Links[num]);
            return;
        }
    }
}