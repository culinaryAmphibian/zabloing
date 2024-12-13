const Discord = require('discord.js');
const fs = require('fs');
const config = require('../../DB/config.json');
const ServerJSON = require('../../DB/servers.json');

const imgCommands = new Discord.Collection();
const imgCommandFiles = fs.readdirSync('./commands/img/').filter(file => file.endsWith('.js'));
for(const imgFile of imgCommandFiles)
{
    const imgCommand = require(`../img/${imgFile}`);
    imgCommands.set(imgCommand.name, imgCommand);
}

module.exports =
{
    name: 'img', description: 'a list of image commands', hide: true,
    execute(message)
    {
        let embed = {color: global.blue, title: 'a list of image commands', fields: [], footer: global.footer};
        embed.fields.push({ name: `just images`, value: Object.keys(config.imageLinks.images).filter(a => !config.imageLinks.images[a].endsWith('gif')).join(', ')});
        embed.fields.push({name: 'gifs/videos', value: Object.keys(config.imageLinks.images).filter(a => config.imageLinks.images[a].endsWith('gif')).concat(Object.keys(config.imageLinks.videos)).join(', ')});
        embed.fields.push({name: 'special commands', value: imgCommands.filter(c => !c.hide).map(c => c.name[0]).join(', ')});
        if (ServerJSON[message.guild.id]?.cmds?.find(c => c.response.match(/https:\/\/([a-z0-9\-]+\.)+[a-z]{2,6}([^/#?]+)+\.(mov|mp4|webm|png|jpg|jpeg|gif)/gi)))
        {
            let x = [];
            ServerJSON[message.guild.id].cmds.filter(c => c.response.match(/https:\/\/([a-z0-9\-]+\.)+[a-z]{2,6}([^/#?]+)+\.(mov|mp4|webm|png|jpg|jpeg|gif)/gi))
            .forEach(j => x.push(j.name));
            embed.fields.push({name: 'commands in your server', value: x.join(', ')});
        }
        return message.channel.send({embeds:[embed]});
    }
}