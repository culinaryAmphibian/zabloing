const { writeFileSync } = require('fs');
const UserJSON = require('../../DB/users.json');
const ServerJSON = require('../../DB/servers.json');

module.exports =
{
    name: 'userdb', description: `enters the user into the database automatically and other stuffs`, hide: true,
    execute(message, bot) {
        let id = UserJSON[message.author.id];
        if (!id)
            bot.allCommands.get('newUser').execute(message.author, message.guild.id);
        if (id.name.at(-1).name != message.author.tag)
            id.name.push({name: message.author.tag, timeStamp: new Date().getTime()});
        id.msgs++;
        if (!id.servers.find(s => s.guildId == message.guild.id))
            id.servers.push({guildId: message.guild.id, time: new Date().getTime(), actualJoin: false});
        writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
    }
}