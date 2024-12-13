const Discord = require('discord.js');
const fs = require('fs');
const ConfigJSON = require('../../DB/config.json');
const ServerJSON = require('../../DB/servers.json');

const questions = ['what is the name of the alias?', 'what command is it for?'];
let errEmbed = {color: global.orangeCol, title: 'error', description: 'you need to have the permissions to manage messages to create aliases.', footer: global.footer};

module.exports =
{
    name: ['alias'], description: 'allows you to set command aliases.', note: 'permissions to manage messages is required',
    execute(message, args, bot)
    {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send({embed:errEmbed});
        let counter = 0;
        const filter = m => m.author.id == message.author.id && m.content;
        const collector = new Discord.MessageCollector(message.channel, filter, {max: questions.length});
        message.channel.send(questions[counter++]);
        collector.on('collect', () => message.channel.send(questions[1]));
        collector.on('end', collected =>
        {
            errEmbed.description = 'you did not answer all the questions!';
            if (collected.size != questions.length) return message.channel.send({embed: errEmbed});

            // alias name and name of the target command
            let aliasName = collected.first().content;
            let cmdName = collected.last().content.split(' ').shift();

            // if the user isn't supposed to use a command
            errEmbed.description = 'no secret commands for you!';
            let secretcmds = bot.allCommands.filter(c => c.hide);
            if (secretcmds.find(c => ((typeof c.name == 'string') && (c.name == cmdName)) || ((typeof c.name == 'object') && (c.name.includes(cmdName)))))
            return message.channel.send({embed: errEmbed});

            // if the command doesn't exist
            let allImg = Object.keys(ConfigJSON.imageLinks.images).concat(Object.keys(ConfigJSON.imageLinks.videos));
            errEmbed.description = 'i couldn\'t find that command.';
            if (!bot.commands.find(c => c.name.includes(cmdName)) && !ServerJSON[message.guild.id].cmds.find(c => c.name == cmd) && !allImg.includes(cmdName))
            return message.channel.send({embed:errEmbed});

            // if the alias is already a command name
            errEmbed.description = 'that alias is already a command name!';
            if (allImg.includes(aliasName) || ServerJSON[message.guild.id].cmds?.map(c => c.name).includes(aliasName) || bot.commands.find(c => c.name.includes(aliasName)))
            return message.channel.send({embed:errEmbed});

            // if the command is disabled
            let disabledBotCmds = bot.commands.filter(c => ServerJSON[message.guild.id].disabled?.find?.(d => c.name.includes(d)));
            errEmbed.description = 'that command is disabled.';
            if (ServerJSON[message.guild.id]?.disabled?.includes(cmdName) || disabledBotCmds.find(cmd => cmd.name.includes(cmdName)))
            return message.channel.send({embed:errEmbed});

            // we have eliminated setting aliases for commands that don't exist
            // and setting aliases that already exist
            // and aliases for commands that are disabled
            // now to actually create the aliases in the database
            if (!ServerJSON[message.guild.id].cmds) ServerJSON[message.guild.id].cmds = [];
            ServerJSON[message.guild.id].cmds.push({name: aliasName, response: `[pref]${cmdName}`, type: 'alias', author: message.author.id, time: new Date().getTime()});
            fs.writeFileSync('./DB/servers.json', JSON.stringify(ServerJSON, null, 2));
            errEmbed.color = global.greenCol;
            errEmbed.title = 'success';
            errEmbed.description = `the alias ${aliasName} has successfully beeen created for the ${cmdName} command.`;
            return message.channel.send({embed:errEmbed});
        })
    }
}