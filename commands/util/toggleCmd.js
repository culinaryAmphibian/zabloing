const fs = require('fs');
const ConfigJSON = require('../../DB/config.json').imageLinks;
const ServerJSON = require('../../DB/servers.json');

let succEmbed = {color: global.greenCol, title: 'success', description: '', footer: global.footer};
let errEmbed = {color: global.orangeCol, title: 'error', description: 'you don\'t have the permissions!', footer: global.footer};

module.exports =
{
    name: ['toggle', 'switch', 'enable', 'disable', 'turnoff', 'turnon'], description: 'enables or disables a command',
    usage: '[pref]toggle <command name>\nexample: [pref]disable color',
    note: 'the permission to manage messages is required.',
    execute(message, args, bot)
    {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send({embed: errEmbed});
        let cmdToToggle = args.slice(1).join(' ');
        errEmbed.description = '';
        if (!cmdToToggle) return message.channel.send({embed: errEmbed});
        errEmbed.description = 'you can\'t disable that command!';
        if (['enable', 'disable', 'turnoff', 'turnon', 'toggle', 'switch'].includes(cmdToToggle)) return message.channel.send({embed: errEmbed});
        let imgCmds = Object.keys(ConfigJSON.images).concat(Object.keys(ConfigJSON.videos));
        // check if the command exists.
        errEmbed.description = 'that command doesn\'t exist.';
        if (!(imgCmds.includes(cmdToToggle) || ServerJSON[message.guild.id].cmds.map(c => c.name).includes(cmdToToggle) || bot.commands.find(c => c.name.includes(cmdToToggle))))
        return message.channel.send({embed: errEmbed});
        switch(args[0])
        {
            case 'enable', 'turnon':
                errEmbed.description = 'no commands are disabled in this server.';
                if (!ServerJSON[message.guild.id].disabled) return message.channel.send({embed: errEmbed});
                errEmbed.description = 'that command isn\'t disabled.'
                if (!ServerJSON[message.guild.id].disabled.includes(cmdToToggle)) return message.channel.send({embed: errEmbed});
                ServerJSON[message.guild.id]?.disabled?.splice(ServerJSON[message.guild.id].disabled.indexOf(cmdToToggle), 1);
                succEmbed.description = `the ${cmdToToggle} command has been enabled.`;
                break;
            case 'disable', 'turnoff':
                errEmbed.description = 'that command is already disabled.';
                if (ServerJSON[message.guild.id]?.disabled?.includes(cmdToToggle)) return message.channel.send({embed: errEmbed});
                if (!ServerJSON[message.guild.id].disabled) ServerJSON[message.guild.id].disabled = [];
                ServerJSON[message.guild.id].disabled.push(cmdToToggle);
                succEmbed.description = `the ${cmdToToggle} command has been disabled.`;
                break;
            default:
                if (ServerJSON[message.guild.id]?.disabled?.includes?.(cmdToToggle)) args.splice(0, 1, 'disable');
                else args.splice(0, 1, 'enable');
                return bot.commands.find(c => c.name.includes('toggle')).execute(message, args, bot);
        }
        fs.writeFileSync('./DB/servers.json', JSON.stringify(ServerJSON, null, 2));
        return message.channel.send({embed: succEmbed});
        // cmdToToggle checks
    }
}