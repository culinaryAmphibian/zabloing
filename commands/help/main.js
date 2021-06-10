const Discord = require('discord.js');
const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

const helpCommands = new Discord.Collection();
const helpCommandFiles = fs.readdirSync('./commands/help/').filter(file => file.endsWith('.js') && !file.startsWith('main'));
for (const helpFile of helpCommandFiles)
{
    const helpCommand = require(`../help/${helpFile}`);
    helpCommands.set(helpCommand.name, helpCommand);
}
helpCommands.filter(c => !c.hide);

module.exports =
{
    name: ['help'], description: 'lists of available commands',
    execute(message, args, bot)
    {
        let prefix = ServerJSON[message.guild.id].prefix || '.';
        if (args[1])
        {
            args[1] = args[1].toLowerCase();
            if (helpCommands.get(args[1])) return helpCommands.get(args[1]).execute(message, prefix, args);
            else if (bot.commands.filter(x => !x.hide).find(c => c.name.includes(args[1]))) return helpCommands.get('cmd').execute(message, args, bot);
            else return;
        } else
        {
            let helpEmbd = {color: blueCol, title: `hey there!`, description: 'here is a list of all my command categories.', fields: [], footer: global.footer};
            helpCommands.filter(c => c.hide).each(c => helpEmbd.fields.push({name: `${prefix}help ${c.name}`, value: c.description}));
            helpEmbd.fields.push({name: 'individual commands', value: `you can also do ${prefix}help <command name> for a help page of that command.`});
            return message.channel.send({embed:helpEmbd});
        }
    }
}