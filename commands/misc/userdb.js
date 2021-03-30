const fs = require('fs');

module.exports =
{
    name: 'userdb', description: `enters the user into the database automatically and other stuffs`,
    execute(message, UserJSON)
    {
        if (!UserJSON[message.author.id])
        {
            UserJSON[message.author.id] =
            {
                lastMessage: new Date().getTime(),
                name: [`${message.author.tag}`],
                servers: [`${message.guild.id}`],
                ignore: false,
                lastAsked: new Date().getTime(),
                msgs: 0,
                cooldowns:
                {
                    hangman: 0,
                },
                games:
                {
                    bal: 0,
                    hangman:
                    {
                        playing: false,
                        lastGameLink: 0,
                        gamesPlayed: 0,
                        gamesWon: 0
                    }
                }
            }
            fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
        }
        if ( ((new Date().getTime()) - UserJSON[message.author.id].lastMessage ) > ( 1000 * 60 * 60 * 6 ) )
        {
            message.channel.send(`hey there, ${message.author.username}! I haven't seen you in ${ Math.floor((( new Date().getTime()) - (UserJSON[message.author.id].lastMessage))/(1000 * 60 * 60)) } hours!`);
        }
        UserJSON[message.author.id].lastMessage = new Date().getTime();
        if (!UserJSON[message.author.id].name.includes(message.author.tag))
        {
            UserJSON[message.author.id].name.push(message.author.tag);
        }
        if (!UserJSON[message.author.id].msgs)
        {
            UserJSON[message.author.id].msgs = 0;
        }
        UserJSON[message.author.id].msgs++;
        if (!UserJSON[message.author.id].cooldowns) UserJSON[message.author.id].cooldowns = {};
        if (!UserJSON[message.author.id].games) UserJSON[message.author.id].games = {};
        if (!UserJSON[message.author.id].games) UserJSON[message.author.id].games.bal = 0;
        if (!UserJSON[message.author.id].playing) UserJSON[message.author.id].playing = false;
        if (!UserJSON[message.author.id].lastGameLink) UserJSON[message.author.id  ].lastGameLink = 0;
        if (message.guild)
        {
            if (!UserJSON[message.author.id].servers.includes(message.guild.id))
            {
                UserJSON[message.author.id].servers[ (UserJSON[message.author.id].servers.length) ] = message.guild.id;
            }
        }
        fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
    }
}