const fs = require('fs');
const UserJSON = require('../../DB/users.json');
const ServerJSON = require('../../DB/servers.json');

module.exports =
{
    name: 'userdb', description: `enters the user into the database automatically and other stuffs`, hide: true,
    async execute(message, bot)
    {
        let id = UserJSON[message.author.id];
        if (!id) await bot.commandsForInternalProcesses.get('newUser').execute(message.author, message.guild.id);
        if (id?.name?.slice?.(-1)?.[0]?.name !== message.author.tag) id?.name?.push?.({name: message.author.tag, timeStamp: new Date().getTime()});
        if (!id?.cooldowns) id.cooldowns = {};
        if (!id?.games) id.games = {bal: 0};
        if (!id?.msgs) id.msgs = 1;
        else id.msgs++;
        if (!id?.servers.map(s => s.guildId || s).includes(message.guild.id)) id.servers.push({guildId: message.guild.id, time: new Date().getTime(), actualJoin: false});
        fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
        if (ServerJSON[message.guild.id].log?.filter?.(a => a.type == 'namechange').pop().newName !== message.guild.name)
        ServerJSON[message.guild.id].log?.push?.({type: 'namechange', time: new Date().getTime(), newName: message.guild.name});
        return fs.writeFileSync('./DB/servers.json', JSON.stringify(ServerJSON, null, 2));
    }
}