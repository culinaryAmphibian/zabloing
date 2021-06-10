const Discord = require('discord.js');
const fs = require('fs');

module.exports =
{
    name: 'cmdInit', hide: true,
    execute(bot)
    {
        bot.commands = new Discord.Collection();
        fs.readdirSync('./commands/')
        .forEach(folder => fs.readdirSync(`./commands/${folder}/`)
        .forEach(file => bot.commands.set(require(`./commands/${folder}/${file}`).name, require(`./commands/${folder}/${file}`))));
        bot.commandsForInternalProcesses = bot.commands.clone();
        bot.commands.sweep(c => c.hide && typeof c.name != 'object');
        return bot;
    }
}