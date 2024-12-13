const Discord = require('discord.js');
const fs = require('fs');
const Config = require('../../DB/config.json');


const econCommands = new Discord.Collection();
const econCommandFiles = fs.readdirSync('./commands/econ/').filter(file => file.endsWith('.js'));
for(const econFile of econCommandFiles)
{
    const econCommand = require(`../econ/${econFile}`);
    econCommands.set(econCommand.name, econCommand);
}

module.exports =
{
    name: 'econ', hide: true, description: 'a list of the economy game commands',
    execute(message, prefix)
    {
        let embed2 = { color: global.green, title: 'economy game commands', fields: [], footer: { name: global.eft, icon_url: global.efi } }
        econCommands.each(c => embed2.fields.push({name: `${prefix}${c.name.shift()}`, value: c.description.replace(/\[pref\]/gi, prefix).replace(/\[curr\]/gi, Config.currency)}));
        embed2.fields.push({name: `wait, so how do i get the points?`, value: `collect daily rewards and win the hangman game when you play it (${prefix}idk)`});
        return message.channel.send({embeds:[embed2]});
    }
}