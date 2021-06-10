const Discord = require('discord.js');
const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');

const utilCommands = new Discord.Collection();
const utilCommandFiles = fs.readdirSync('./commands/util/').filter(file => file.endsWith('.js'));
for(const utilFile of utilCommandFiles)
{
    const utilCommand = require(`../util/${utilFile}`);
    utilCommands.set(utilCommand.name, utilCommand);
}

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'util', description: 'a list of bot utility/management commands', hide: true,
    execute(message)
    {
        let prefix = ServerJSON[message.guild.id].prefix || '.';
        utilCommands.filter(c => !c.hide || c.userUsable);
        let embed = {color: blueCol, title: 'a list of bot configuration commands', fields: [], footer: global.footer};
        utilCommands.each(c =>
        {
            let usag;
            c.usage ? usag = c.usage : usag = `${prefix}${c.name} (this command doesn't accept any parameters)`;
            embed.fields.push({name: prefix + c.name, value: `${c.description}\n${usag}`});
        });
        return message.channel.send({embed:embed});
    }
}