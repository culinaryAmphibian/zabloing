const Discord = require('discord.js');
const fs = require('fs');
const ConfigJSON = require('../../DB/config.json').imageLinks;
const serverJSON = require('../../DB/servers.json');
const SecretJSON = require('../../DB/secret.json');

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

let errEmbed = {color: orangeCol, title: 'error', description: 'you don\'t have the permission to manage messages.', footer: global.footer};
const questions = ['what should it be called?', 'what should it send back?'];

module.exports =
{
    name: ['addcmd'], description: 'allows you to add a command', note: 'permission to manage messages is required.',
    execute(message, args, bot)
    {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send({embed: errEmbed});
        let counter = 0;
        const filter = m => m.author.id == message.author.id;
        const collector = new Discord.MessageCollector(message.channel, filter, {max: questions.length});
        message.channel.send(questions[counter++]);
        collector.on('collect', () => message.channel.send(questions[counter++]));
        collector.on('end', async(collected) =>
        {
            // if a alias and command name have been provided
            errEmbed.description = 'you didn\'t answer all the questions! please try again.';
            if (collected.size < questions.length) return message.channel.send({embed: errEmbed});

            // if profanity
            errEmbed.description = 'no profanity!';
            if (SecretJSON.badWords.find(bw => collected.map(c => c.content).join(' ').split(' ').includes(bw))) return message.channel.send({embed: errEmbed});

            let name = collected.first().content;
            let response = collected.last().content;

            if (response.attachments) response.attachments.each(a => response += ` ${a.url}`);

            let mentions = collected.filter(h => h.mentions);
            if (mentions) mentions.each(m => m.content = m.content.split(' ').filter(c => !c.content.match(/<(@!?|@&)?\d{17,19}/g) || !c.content.match(/@(everyone|here)/g)).join(' '));

            // bot command with the same trigger
            errEmbed.description = 'a bot command shares that name!';
            if (bot.commands.find(c => c.name.includes(name.toLowerCase())))
            return message.channel.send({embed:errEmbed});

            // server command with the same response
            errEmbed.description = 'a command with the same response already exists.';
            if (serverJSON[message.guild.id].cmds?.find(c => c.response == response)) return message.channel.send({embed: errEmbed});

            // server or image command with the same name
            errEmbed.description = 'that command already exists.';
            if (serverJSON[message.guild.id]?.cmds?.map?.(a => a.name).find?.(c => c.includes(name)) || ConfigJSON.images[a] || ConfigJSON.videos[a])
            return message.channel.send({embed:errEmbed});

            //trying to finesse the system
            let prefix = serverJSON[message.guild.id].prefix || '.';
            if (response.startsWith('[pref]')) response = prefix + response.slice(6);

            // has the same response as an image command.
            errEmbed.description = 'use the alias command, that response is already accessible as an image command.';
            if (Object.values(ConfigJSON.images).concat(Object.values(ConfigJSON.videos)).includes(response))
            return message.channel.send({embed: errEmbed});

            if (!serverJSON[message.guild.id].cmds) serverJSON[message.guild.id].cmds = [];
            serverJSON[message.guild.id].cmds.push({name: name, response: response, author: message.author.id, time: new Date().getTime()});
            fs.writeFileSync('./DB/servers.json', JSON.stringify(serverJSON, null, 2));
            let embed = {color: greenCol, title: 'success', description: `${name} command has been added`, footer: global.footer};
            return message.channel.send({embed:embed});
        })
    }
}