const Discord = require('discord.js');
const fs = require('fs');
const ConfigJSON = require('../../DB/config.json').imageLinks;
const serverJSON = require('../../DB/servers.json');
const SecretJSON = require('../../DB/secret.json');

let errEmbed = {color: global.orange, title: 'error', description: 'you don\'t have the permission to manage messages.', footer: global.footer};
const questions = ['what should it be called?', 'what should it send back?'];

module.exports =
{
    name: ['addcmd'], description: 'allows you to add a command', note: 'permission to manage messages is required.',
    execute(message, args, bot)
    {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send({embeds: [errEmbed]});
        let counter = 0;
        const filter = m => m.author.id == message.author.id;
        const collector = new Discord.MessageCollector(message.channel, filter, {max: questions.length});
        message.channel.send(questions[counter++]);
        collector.on('collect', () => message.channel.send(questions[counter++]));
        collector.on('end', async(collected) =>
        {
            // if a alias and command name have been provided
            errEmbed.description = 'you didn\'t answer all the questions! please try again.';
            if (collected.size < questions.length) return message.channel.send({embeds: [errEmbed]});

            // if profanity
            errEmbed.description = 'no profanity!';
            if (SecretJSON.badWords.find(bw => collected.map(c => c.content).join(' ').split(' ').includes(bw))) return message.channel.send({embeds: [errEmbed]});

            let name = collected.first().content;
            let response = collected.last().content;

            if (response.attachments) response.attachments.each(a => response += ` ${a.url}`);

            let mentions = collected.filter(h => h.mentions);
            if (mentions) mentions.each(m => m.content = m.content.split(' ').filter(c => !c.content.match(/<(@!?|@&)?\d{17,19}/g) || !c.content.match(/@(everyone|here)/g)).join(' '));

            // bot command with the same trigger
            errEmbed.description = 'a bot command shares that name!';
            if (bot.commands.find(c => c.name.includes(name.toLowerCase())))
            return message.channel.send({embeds:[errEmbed]});

            // server command with the same response
            errEmbed.description = 'a command with the same response already exists.';
            if (serverJSON[message.guild.id].cmds?.find(c => c.response == response)) return message.channel.send({embeds: [errEmbed]});

            // server or image command with the same name
            errEmbed.description = 'that command already exists.';
            if (serverJSON[message.guild.id]?.cmds?.map?.(a => a.name).find?.(c => c.includes(name)) || ConfigJSON.images[a] || ConfigJSON.videos[a])
            return message.channel.send({embeds:[errEmbed]});

            //trying to finesse the system
            let prefix = serverJSON[message.guild.id].prefix || '.';
            if (response.startsWith('[pref]')) response = prefix + response.slice(6);

            // has the same response as an image command.
            errEmbed.description = 'use the alias command, that response is already accessible as an image command.';
            if (Object.values(ConfigJSON.images).concat(Object.values(ConfigJSON.videos)).includes(response))
            return message.channel.send({embeds: [errEmbed]});

            if (!serverJSON[message.guild.id].cmds) serverJSON[message.guild.id].cmds = [];
            serverJSON[message.guild.id].cmds.push({name: name, response: response, author: message.author.id, time: new Date().getTime()});
            fs.writeFileSync('./DB/servers.json', JSON.stringify(serverJSON, null, 2));
            let embed = {color: global.green, title: 'success', description: `${name} command has been added`, footer: global.footer};
            return message.channel.send({embeds:[embed]});
        })
    }
}