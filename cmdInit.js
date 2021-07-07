const {Collection} = require('discord.js');
const {readdirSync} = require('fs');

module.exports =
{
    name: 'cmdInit', hide: true,
    execute(bot)
    {
        console.log('on');
        bot.commands = new Collection();
        readdirSync('./commands/')
        .forEach(folder => readdirSync(`./commands/${folder}/`)
        .forEach(file => bot.commands.set(require(`./commands/${folder}/${file}`).name, require(`./commands/${folder}/${file}`))));
        bot.commandsForInternalProcesses = bot.commands.clone();
        bot.commands.sweep(c => c.hide && typeof c.name != 'object');

        readdirSync('./commands/events/').forEach(event =>
        {
            const eventFile = require(`./commands/events/${event}`);
            bot.on(eventFile.name, async(param1, param2) => eventFile.execute(bot, param1, param2));
        })
        return bot;
    }
}