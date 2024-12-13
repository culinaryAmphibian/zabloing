const Discord = require('discord.js');
const fs = require('fs');

const modCommands = new Discord.Collection();
const modCommandFiles = fs.readdirSync('./commands/mod/').filter(file => file.endsWith('.js'));
for(const modFile of modCommandFiles)
{
    const modCommand = require(`../mod/${modFile}`);
    modCommands.set(modCommand.name, modCommand);
}

module.exports =
{
    name: 'mod', description: 'a list of commands used for moderation', hide: true,
    execute(message, prefix)
    {
        let modHelpEmbed = {color: global.blue, title: 'a list of commands for moderation', fields: [], footer: global.footer};
        modCommands.filter(c => !c.hide).each(cmd => modHelpEmbed.fields.push({name: `${prefix}${cmd.name[0]}`, value: cmd.description}));
        return message.channel.send({embeds:[modHelpEmbed]});
    }
}