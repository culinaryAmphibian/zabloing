const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');

let greenCol = [(Math.floor(Math.random() * 50)) + 1,(Math.floor(Math.random() * 54)) + 201,(Math.floor(Math.random() * 40)) + 40];

module.exports =
{
    name: 'setPrefix', hide: true, userUsable: true, description: 'allows you to change the bot\'s prefix in a server.', usage: '<new prefix>setprefix',
    note: 'there is an arbitrary limit of three characters; the prefix can only be changed by users who have the perms to manage messages',
    execute(message)
    {
        message.content = message.content.toLowerCase();
        if (message.author.id != message.guild.ownerID) return message.channel.send('only the server owner can change the prefix.');

        let newPrefLen = message.content.lastIndexOf('setprefix');
        if (newPrefLen > 2) 
        return message.channel.send('please keep the prefix to a length of 3 characters.');
        ServerJSON[message.guild.id].prefix = message.content.slice(0, newPrefLen);
        if (!ServerJSON[message.guild.id].prefixEdits) ServerJSON[message.guild.id].prefixEdits = [];
        ServerJSON[message.guild.id].prefixEdits.push({author: message.author.id, time: new Date().getTime(), changedTo: ServerJSON[message.guild.id].prefix});
        fs.writeFileSync('./DB/servers.json', JSON.stringify(ServerJSON, null, 2));
        let embed = { color: greenCol, title: 'success', description: `my prefix in this server has been changed to "${ServerJSON[message.guild.id].prefix}"`, footer: global.footer };
        return message.channel.send({embed:embed});
    }
}