const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');

module.exports =
{
    name: 'newServer', hide: true,
    execute(guild)
    {
        if (ServerJSON[guild.id]) return;
        ServerJSON[guild.id] =
        {
            name: [{name: guild.name, time: new Date().getTime()}],
            cmds: [], disabledCmds: [], currentlyInThere: true,
            log: [{type: 'join', time: new Date().getTime()}]
        }
        return fs.writeFileSync('./DB/servers.json', JSON.stringify(ServerJSON, null, 2));
    }
}