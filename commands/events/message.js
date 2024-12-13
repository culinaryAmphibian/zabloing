const { PermissionFlagsBits: { SendMessages, Administrator } } = require('discord.js');
const ServerJSON = require('../../DB/servers.json');
const { imageLinks } = require('../../DB/config.json');
const { ownerId } = require('../../DB/secret.json');

module.exports = {
    name: 'messageCreate', hide: true,
    async execute(bot, [message]) {
        if (message.author.bot)
            return;
        bot.allCommands.get('userdb').execute(message, bot);
        bot.allCommands.get('serverdb').execute(message, bot);
        global.footer = {
            text: message.author.username,
            icon_url: message.author.displayAvatarURL({dynamic: true})
        };
        if (!message.guild) {
            let cmd = bot.commands.find(c => c.dmOnly && c.name.includes(message.content.split(' ').shift()));
            return cmd?.execute(message);
        }
        let prefix = ServerJSON[message.guild.id]?.prefix || '.';
        if (!message.guild.members.me.permissions.has(SendMessages) && message.member.permissions.has(Administrator))
            return message.author.send('i don\'t have the permission to send messages!');
        if (message.content == `<@!${bot.user.id}>`)
                message.channel.send(`hey there, my prefix here is ${prefix}`);
        if (message.content.toLowerCase().endsWith('setprefix'))
                return bot.allCommands.get('setPrefix').execute(message);
        if (!message.content.startsWith(prefix))
                return;
    
        let args = message.content.slice(prefix.length).split(' ');
        let a = args[0].toLowerCase();
        let disabledCmds = ServerJSON[message.guild.id].disabled
        if (disabledCmds && disabledCmds.find(cName => bot.commands.find(c => c.name.includes(a) && c.name.includes(cName))))
            return;
        if (imageLinks.images[a] || imageLinks.videos[a])
            return bot.allCommands.get('arbImg').execute(message, a);
        if (ServerJSON[message.guild.id].cmds?.map?.(c => c.name).includes?.(args.join(" ")))
            return bot.allCommands.get('custom').execute(message, bot);
        let command = bot.commands.find(c => c.name.includes(a));
        if (!command && ownerId == message.author.id)
            command = bot.allCommands.find(c => c.name.includes(a));
        if (!command)
            return;
        [global.blueCol, global.orangeCol, global.greenCol, global.redCol] = await bot.allCommands.get('rainbow').execute(message.guild.id);
        return command.execute(message, args, bot);
    }
}