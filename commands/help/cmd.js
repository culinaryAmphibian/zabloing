const Config = require('../../DB/config.json');
const ServerJSON = require('../../DB/servers.json');

module.exports =
{
    name: 'cmd', description: 'help page generator for individual commands', hide: true,
    execute(message, args, bot)
    {
        let prefix = ServerJSON[message.guild.id].prefix || '.';
        let cmd = bot.commands.get(bot.commands.map(c => c.name).find(cmdNames => cmdNames.includes(args[1])));
        let embed = {color: global.blue, title: `${prefix}${cmd.name[0]}`, description: 'aliases: ', fields: [], footer: global.footer};

        let aliases = [];
        if (cmd.name.length > 1) aliases.concat(cmd.name.slice(1));
        let serverAlias = cmd.name.find(n => ServerJSON[message.guild.id]?.cmds?.find?.(c => c.name == (`[pref]${n}`)))
        if (serverAlias) aliases.push(serverAlias.name);
        switch (aliases.length)
        {
            case 0:
                embed.description = 'aliases: none';
                break;
            case 1:
                embed.description += aliases.pop();
                break;
            case 2:
                embed.description += `${aliases[0]} and ${aliases[1]}`;
                break;
            default:
                embed.description += `${aliases.slice(0, -1).join(', ')}, and ${aliases.pop()}`;
                break;
        }
        embed.fields.push({name: 'what does it do?', value: cmd.description.replace(/\[curr\]/gi, Config.currency).replace(/\[pref\]/gi, prefix)});
        let usageVal;
        cmd.usage ? usageVal = cmd.usage.replace(/\[pref\]/gi, prefix).replace(/\[curr\]/gi, Config.currency) : usageVal = `${prefix}${cmd.name[0]} (this command doesn't accept parameters)`;
        embed.fields.push({name: 'usage', value: usageVal});
        if (cmd.note) embed.fields.push({name: 'notes/info', value: cmd.note.replace(/\[pref\]/gi, prefix).replace(/\[curr\]/gi, Config.currency)});
        return message.channel.send({embeds:[embed]});
    }
}