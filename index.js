const Discord = require('discord.js');
const bot = new Discord.Client();
const ConfigJSON = require('./DB/config.json');
const ServerJSON = require('./DB/servers.json');
require('./commands/util/embColors').execute(global);
bot.on('guildCreate', guild => bot.commandsForInternalProcesses.get('guildCreate').execute(bot, guild));
bot.on('guildMemberAdd', member => bot.commandsForInternalProcesses.get('guildMemberAdd').execute(bot, member));
bot.on('guildMemberRemove', member => bot.commandsForInternalProcesses.get('guildMemberRemove').execute(bot, member));
bot.on('guildDelete', guild => bot.commandsForInternalProcesses.get('guildRemove').execute(guild));
bot.on('ready', () => require('./cmdInit').execute(bot));
bot.on('message', async(message) =>
{
    if (message.author.bot) return;
    bot.commandsForInternalProcesses.get('userdb').execute(message, bot);
    global.footer = { text: message.author.username, icon_url: message.author.displayAvatarURL({dynamic: true})};
    if (!message.guild)
    {
        let cmd = bot.commands.find(c => c.dmOnly && c.name.includes(message.content.split(' ').shift()));
        return cmd?.execute(message);
    }
    let prefix = ServerJSON[message.guild.id].prefix || '.';
    if (!message.guild.me.hasPermission('SEND_MESSAGES') && message.member.hasPermission('ADMINISTRATOR'))
    return message.author.send('i don\'t have the permission to send messages!');
    if (message.content == `<@!${bot.user.id}>`) message.channel.send(`hey there, my prefix here is ${prefix}`);
    if (message.content.toLowerCase().endsWith('setprefix')) return bot.commandsForInternalProcesses.get('setPrefix').execute(message);
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).split(' ');
    let a = args[0].toLowerCase();
    if (ServerJSON[message.guild.id].disabled?.find?.(cName => cName == args[0] || cName == args.join(' ') || bot.commands.find(c => c.name.includes(a) && c.name.includes(cName)))) return;
    if (ConfigJSON.imageLinks.images[a] || ConfigJSON.imageLinks.videos[a])
    return bot.commandsForInternalProcesses.get('arbImg').execute(message, a);
    if (ServerJSON[message.guild.id].cmds?.map?.(c => c.name).includes?.(args.join(" ")))
    return bot.commandsForInternalProcesses.get('custom').execute(message, bot);
    let command = bot.commands.find(c => c.name.includes(a))
    if (!command) return;
    global.blueCol = global.orangeCol = global.greenCol = global.redCol = await bot.commandsForInternalProcesses.get('rainbow').execute(message.guild.id);
    command.execute(message, args, bot);
});

bot.login(require('./DB/secret.json').token);