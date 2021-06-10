const fs = require('fs');
const ServersJSON = require('../../DB/servers.json');

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

let embed = {color: blueCol, title: '', description: '', fields: [], footer: global.footer};

module.exports =
{
    name: 'guildCreate', hide: true,
    execute(bot, guild)
    {
        let channel = guild.channels.cache.find(c => c.name.includes('general')) || guild.channels.cache.random();
        if (!channel) return;
        embed.footer.icon_url = guild.iconURL({dynamic: true});
        if (!ServersJSON[guild.id])
        {
            ServersJSON[guild.id] = {prefix: ".", cmds: [], disabledCmds: [], log: []};
            ServersJSON[guild.id].log.push({type: 'join', time: new Date().getTime()});
            fs.writeFileSync('./DB/servers.json', JSON.stringify(ServersJSON, null, 2));
            embed.color = blueCol;
            embed.title = `hi, i\'m ${bot.user.username}!`;
            embed.description = 'nice to meet you';
            embed.fields.push({ name: 'prefix', value: 'my prefix by default is "."'},
                {name: 'you can change my prefix with the setprefix command', value: 'just prefix it with the new prefix.'},
                {name: 'my commands', description: 'type `.help` for a list of commands'});
            channel.send({embed:embed});
        } else
        {
            ServersJSON[guild.id].log.push({type: 'join', time: new Date().getTime()});
            if (ServersJSON[guild.id].log.find(e => e.type == 'namechange').newName !== guild.name) ServersJSON[guild.id].log.push({type: 'namechange', time: new Date().getTime(), newName: guild.name});
            let prefix = ServersJSON[guild.id].prefix;
            embed.title = `hello, i\'m ${bot.user.username}`;
            embed.description = 'something tells me that i\'ve been here before...';
            embed.fields.push({name: 'you know the deal', value: `you can see all my commands through the help command`},
            {name: 'you can change my prefix too!', value: 'prefix the setprefix command with the new prefix'},
            {name: 'also, you can configure more things', value:` for example, you can set a welcome channel using the configure command. use \`${prefix}help configure\` for more info`});
            channel.send({embed: embed});
        }
        return fs.writeFileSync('./DB/servers.json', JSON.stringify(ServersJSON, null, 2));
    }
}