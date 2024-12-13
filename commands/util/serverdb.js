const { writeFileSync } = require('fs');
const ServerJSON = require('../../DB/servers.json');

module.exports = {
    name: 'serverdb', hide: true,
    execute(message, bot) {
        let id = ServerJSON[message.guild.id];
        if (!id)
            bot.allCommands.get('newServer').execute(message.guild);
        if (ServerJSON[message.guild.id].name.at(-1).name !== message.guild.name)
            ServerJSON[message.guild.id].name.push({name: message.guild.name, time: new Date().getTime()});
        return writeFileSync('./DB/servers.json', JSON.stringify(ServerJSON, null, 2));
    }
}