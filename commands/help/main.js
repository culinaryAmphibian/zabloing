let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'help', description: 'lists of available commands',
    execute(message, args, prefix, bot)
    {
        if (args[1])
        {
            switch(args[1])
            {
                case 'img':
                    bot.helpCommands.get('imgHelp').execute(message, prefix);
                    break;
                case 'misc':
                    bot.helpCommands.get('miscHelp').execute(message, prefix, args);
                    break;
                case 'calc':
                    bot.helpCommands.get('calcHelp').execute(message, prefix, args);
                    break;
                case 'econ':
                    break;
                case 'mod':
                    bot.helpCommands.get('modHelp').execute(message, prefix, args);
                    break;
            }
            return;
        } else
        {
            let helpEmbd =
            {
                color: blueCol, title: `hey there!`, description: 'here is a list of all my command categories.',
                fields: [
                    { name: `${prefix}help img`, value: `a list of all commands that return an image` },
                    { name: `${prefix}help misc`, value: `a list of misceallaneous commands` },
                    { name: `${prefix}help econ`, value: `a list of the economy game commands` },
                    { name: `${prefix}help mod`, value: `a list of commands to be used for moderation`}
                ],
                footer: { text: global.eft, icon_url: global.efi }
            };
            message.channel.send({embed:helpEmbd});
            return;
        }
    }
}