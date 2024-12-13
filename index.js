const { Client, GatewayIntentBits: { MessageContent, Guilds } } = require('discord.js');
const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const bot = new Client({ intents: 1 + 2 + 4 + 8 + 64 + 512 + 1024 + 4096 + 32768 });
const { token } = require('./DB/secret.json');

global.orange = (Math.floor(Math.random() * 25) + 230) * 65536 +
    (Math.floor(Math.random() * 40) + 100) * 256 +
    Math.floor(Math.random() * 35);
global.blue = Math.floor(Math.random() * 50) * 65536 +
    (Math.floor(Math.random() * 100) + 50) * 256 +
    Math.floor(Math.random() * 25) + 230;
global.green = Math.floor(Math.random() * 50) * 65536 +
    (Math.floor(Math.random() * 54) + 200) * 256 +
    Math.floor(Math.random() * 40) + 40;
global.red = (Math.floor(Math.random() * 5) * 30 + 100) * 65536 +
    (Math.floor(Math.random() * 50) + 20) * 256 +
    Math.floor(Math.random() * 50) + 20;

bot.commands = new Collection();
readdirSync('./commands/').filter(folder => folder != 'events')
    .forEach(folder => readdirSync(`./commands/${folder}/`)
        .forEach(fileName => {
            const file = require(`./commands/${folder}/${fileName}`);
            bot.commands.set(file.name, file);
        })
    );
bot.allCommands = bot.commands.clone();
bot.commands.sweep(c => c.hide);
const dir = './commands/events/';
readdirSync(dir).forEach(event => {
    const eventFile = require(`${dir}${event}`);
    bot.on(eventFile.name, async (...args) => eventFile.execute(bot, args));
});

bot.login(token);