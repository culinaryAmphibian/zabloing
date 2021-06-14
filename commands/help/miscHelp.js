const Discord = require('discord.js');
const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');

const miscCommands = new Discord.Collection();
const miscCommandFiles = fs.readdirSync('./commands/misc/').filter(file => file.endsWith('.js'));
for(const miscFile of miscCommandFiles)
{
    const miscCommand = require(`../misc/${miscFile}`);
    miscCommands.set(miscCommand.name, miscCommand);
}

module.exports =
{
    name: 'misc', description: `a list of misceallaneous commands`, hide: true,
    execute(message, prefix)
    {
        let miscHelpEmbed = { color: global.blueCol, title: 'a list of misceallaneous commands', fields: [], footer: global.footer};
        miscCommands.filter(c => !c.hide).each(cmd =>
        {
            let cmdName;
            cmd.dmOnly ? cmdName = `${cmd.name} (in dms only)` : cmdName = `${prefix}${cmd.name[0]}`;
            miscHelpEmbed.fields.push({name: cmdName, value: cmd.description});
        });
        if (ServerJSON[message.guild.id].cmds)
        {
            if (ServerJSON[message.guild.id].cmds.find(c => !c.response.match(/https:\/\/([a-z0-9\-]+\.)+[a-z]{2,6}([^/#?]+)+\.(mov|mp4|webm|png|jpg|jpeg|gif)/gi)))
            {
                let others = [];
                ServerJSON[message.guild.id].cmds.filter(c => !c.response.match(/https:\/\/([a-z0-9\-]+\.)+[a-z]{2,6}([^/#?]+)+\.(mov|mp4|webm|png|jpg|jpeg|gif)/gi))
                .forEach(c => others.push(c.name));
                miscHelpEmbed.fields.push({name: 'custom commands in this server', value: others.join(', ')});
            }
        }
        return message.channel.send({embed:miscHelpEmbed});
    }
}