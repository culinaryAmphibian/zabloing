const Discord = require('discord.js');
const fs = require('fs');

const modCommands = new Discord.Collection();
const modCommandFiles = fs.readdirSync('./commands/mod/').filter(file => file.endsWith('.js'));
for(const modFile of modCommandFiles)
{
    const modCommand = require(`../mod/${modFile}`);
    modCommands.set(modCommand.name, modCommand);
}

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'mod', description: 'a list of commands used for moderation', hide: true,
    execute(message, prefix)
    {
        let modHelpEmbed = {color: blueCol, title: 'a list of commands for moderation', fields: [], footer: global.footer};
        modCommands.filter(c => !c.hide).each(cmd => modHelpEmbed.fields.push({name: `${prefix}${cmd.name[0]}`, value: cmd.description}));
        return message.channel.send({embed:modHelpEmbed});
    }
}