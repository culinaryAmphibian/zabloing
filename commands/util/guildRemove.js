const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');

module.exports =
{
    name: 'guildRemove', hide: true,
    execute(guild)
    {
        ServerJSON[guild.id]?.log?.push({type: 'leave', time: new Date().getTime()});
        ServerJSON[guild.id].currentlyInThere = false;
        return fs.writeFileSync('./DB/servers.json', JSON.stringify(ServerJSON, null, 2));
    }
}