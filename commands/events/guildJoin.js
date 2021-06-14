const fs = require('fs');
const ServersJSON = require('../../DB/servers.json');

let embed = {color: global.blueCol, title: '', description: '', fields: [], footer: global.footer};

module.exports =
{
    name: 'guildCreate', hide: true,
    async execute(bot, guild)
    {
        let channel = guild.channels.cache.find(c => c.name.includes('general')) || guild.channels.cache.random();
        if (!channel) return;
        embed.footer.icon_url = guild.iconURL({dynamic: true});
        if (!ServersJSON[guild.id])
        {
            await bot.commandsForInternalProcesses.get('newServer').execute(guild);
            embed.title = `hi, i\'m ${bot.user.username}!`;
            embed.description = 'nice to meet you';
            embed.fields.push({ name: 'prefix', value: 'my prefix by default is "."'},
                {name: 'you can change my prefix with the setprefix command', value: 'just prefix it with the new prefix.'},
                {name: 'my commands', description: 'type `.help` for a list of commands'});
            return channel.send({embed:embed});
        }
        ServersJSON[guild.id].log.push({type: 'join', time: new Date().getTime()});
        ServersJSON[guild.id].currentlyInThere = true;
        if (ServersJSON[guild.id].log?.filter?.(e => e.type == 'namechange')?.pop?.()?.newName !== guild.name) ServersJSON[guild.id].log?.push?.({type: 'namechange', time: new Date().getTime(), newName: guild.name});
        let prefix = ServersJSON[guild.id].prefix || '.';
        embed.title = `hello, i\'m ${bot.user.username}`;
        embed.description = 'something tells me that i\'ve been here before...';
        embed.fields.push({name: `my`, value: `you can see all my commands through the help command`},
        {name: `my current prefix is ${prefix}`, value: 'you can change it by running <preferred prefix>setprefix'});
        channel.send({embed: embed});
        return fs.writeFileSync('./DB/servers.json', JSON.stringify(ServersJSON, null, 2));
    }
}