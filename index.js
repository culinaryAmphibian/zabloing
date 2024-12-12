const { Client, GatewayIntentBits } = require('discord.js');
const { intents } = require('./DB/config.json');
const bot = new Client({ intents: GatewayIntentBits.Guilds });
const ServerJSON = require('./DB/servers.json');
const { token } = require('./DB/secret.json');

require('./commands/util/embColors').execute();

bot.on('ready', () => require('./cmdInit').execute(bot));

bot.on('message', async(message) => {
    if (message.author.bot)
        return;
    bot.commandsForInternalProcesses.get('userdb').execute(message, bot);
    global.footer = {
        text: message.author.username,
        icon_url: message.author.displayAvatarURL({dynamic: true})
    };
    if (!message.guild) {
        let cmd = bot.commands.find(c => c.dmOnly && c.name.includes(message.content.split(' ').shift()));
        return cmd?.execute(message);
    }
    let prefix = ServerJSON[message.guild.id].prefix || '.';
    if (!message.guild.me.hasPermission('SEND_MESSAGES') && message.member.hasPermission('ADMINISTRATOR'))
        return message.author.send('i don\'t have the permission to send messages!');
    if (message.content == `<@!${bot.user.id}>`)
            message.channel.send(`hey there, my prefix here is ${prefix}`);
    if (message.content.toLowerCase().endsWith('setprefix'))
            return bot.commandsForInternalProcesses.get('setPrefix').execute(message);
    if (!message.content.startsWith(prefix))
            return;

    let args = message.content.slice(prefix.length).split(' ');
    let a = args[0].toLowerCase();
    if (ServerJSON[message.guild.id].disabled?.find?.(cName => cName == args[0] ||
        cName == args.join(' ') ||
        bot.commands.find(c => c.name.includes(a) && c.name.includes(cName))) ||
        (ServerJSON[message.guild.id]?.pendingMembers?.includes(message.author.id) && a !== 'verify'))
        return;
    if (ConfigJSON.imageLinks.images[a] || imageLinks.videos[a])
        return bot.commandsForInternalProcesses.get('arbImg').execute(message, a);
    if (ServerJSON[message.guild.id].cmds?.map?.(c => c.name).includes?.(args.join(" ")))
        return bot.commandsForInternalProcesses.get('custom').execute(message, bot);
    if (require('./DB/secret.json').ownerId == message.author.id)
        bot.commands = bot.commandsForInternalProcesses;
    let command = bot.commands.find(c => c.name.includes(a))
    if (!command)
        return;
    [global.blueCol, global.orangeCol, global.greenCol, global.redCol] = await bot.commandsForInternalProcesses.get('rainbow').execute(message.guild.id);
    return command.execute(message, args, bot);
});

bot.login(token);