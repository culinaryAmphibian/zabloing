const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const ServerJSON = require('../../DB/servers.json');

const helpCommands = new Collection();
readdirSync(__dirname).filter(file => !__filename.endsWith(file)).forEach(helpFile => {
    const helpCommand = require(`../help/${helpFile}`);
    helpCommands.set(helpCommand.name, helpCommand);
});

let helpEmbed = {
    title: `hey there!`,
    description: 'here is a list of all my command categories.',
    fields: []
};

module.exports =
{
    name: ['help'], description: 'lists of available commands',
    execute(message, args, bot) {
        let prefix = ServerJSON[message.guild.id].prefix || '.';
        if (args[1]) {
            args[1] = args[1].toLowerCase();
            if (helpCommands.get(args[1]))
                return helpCommands.get(args[1]).execute(message, prefix, args);
            else if (bot.commands.find(c => c.name.includes(args[1])))
                return helpCommands.get('cmd').execute(message, args, bot);
        } else {
            helpEmbed.color = global.blue;
            helpEmbed.footer = global.footer;
            helpEmbed.fields = [];
            helpCommands.forEach(c => helpEmbed.fields.push({
                    name: `${prefix}help ${c.name}`, 
                    value: c.description
                }));
            helpEmbed.fields.push({
                name: 'individual commands',
                value: `you can also type ${prefix}help <command name> for a help page of that command.`
            });
            console.log(helpEmbed);
            return message.channel.send({embeds:[helpEmbed]});
        }
    }
}