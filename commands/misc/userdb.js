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
                avatarHash: message.author.avatar,
                pfp: message.author.displayAvatarURL({dynamic:true, size:4096}),
                ignore: false
            }
            fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
        }
        if ( ((new Date().getTime()) - UserJSON[message.author.id].lastMessage) > (1000 * 60 * 60 * 6) )
        {
            message.channel.send(`hey there, ${message.author.username}! I haven't seen you in ${ Math.floor((( new Date().getTime()) - (UserJSON[message.author.id].lastMessage))/(1000 * 60 * 60)) } hours!`);
        }
        UserJSON[message.author.id].lastMessage = new Date().getTime();
        if (UserJSON[message.author.id].name !== message.author.tag)
        {
            UserJSON[message.author.id].name[ (UserJSON[message.author.id].name.length) ] = message.author.tag;
        }
        if (!UserJSON[message.author.id].servers.includes(message.guild.id))
        {
            UserJSON[message.author.id].servers[ (UserJSON[message.author.id].servers.length) ] = message.guild.id;
        }
        fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
    }
}