const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
module.exports = {
    name: 'cmdInit', hide: true,
    execute(bot) {
        console.log('on');
        bot.commands = new Collection();
        readdirSync('./commands/')
            .forEach(folder => readdirSync(`./commands/${folder}/`)
                .forEach(fileName => {
                    const file = require(`./commands/${folder}/${fileName}`);
                    bot.commands.set(file.name, file);
                })
            );
        bot.commandsForInternalProcesses = bot.commands.clone();
        bot.commands.sweep(c => c.hide);

        readdirSync('./commands/events/').forEach(event => {
            const eventFile = require(`./commands/events/${event}`);
            bot.on(eventFile.name, async (...args) => eventFile.execute(bot, args));
        });
    }
}