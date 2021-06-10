const Discord = require('discord.js');
const fs = require('fs');
const SecretJSON = require('../../DB/secret.json').badWords;
const ServerJSON = require('../../DB/servers.json');

let b_r = Math.floor(Math.random() * 50);
let b_g = Math.floor(Math.random() * 100) + 50;
let b_b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [b_r,b_g,b_b];

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

let errEmbed = {color: orangeCol, title: 'error', description: 'this guild doesn\'t have commands in the first place!', footer: global.footer};
let succEmbed = {color: blueCol, title: 'success', description: 'the ', footer: global.footer};

const questions = ['what is the name of the command that you want to edit?', 'do you want to edit the trigger, the response, or delete the command altogether?', 'what do you want to change it to?'];

module.exports =
{
    name: ['editcmd'], description: 'edits a custom command\'s trigger or response',
    execute(message)
    {
        if (!ServerJSON[message.guild.id].cmds) return message.channel.send({embed: errEmbed});
        errEmbed.description = 'you must have permission to manage messages to edit commands.';
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send({embed:errEmbed});
        let counter = 0;
        const filter = m => m.author.id == message.author.id;
        const collector = new Discord.MessageCollector(message.channel, filter, {max: questions.length});
        message.channel.send(questions[counter++]);
        collector.on('collect', () => message.channel.send(questions[counter++]));
        collector.on('end', collected =>
        {
            errEmbed.description = 'you didn\'t respond to all the questions. please try again.';
            if (collected.size < questions.length) return message.channel.send({embed: errEmbed});
            collected = collected.array();
            let mentions = collected.slice(1).filter(m => m.mentions);
            if (mentions) mentions.forEach(m => m.content = m.content.split(' ').filter(c => !c.match(/<(@!?|@&)?\d{17,19}/g) || !c.match(/@(everyone|here)/g)).join(' '));
            let cmdToEdit = ServerJSON[message.guild.id].cmds.find(c => c.name == collected[0].content);
            errEmbed.description = 'that command does not exist in this server or it is not editable.';
            if (!cmdToEdit) return message.channel.send({embed: errEmbed});
            errEmbed.description = 'please use the editalias command to edit aliases.';
            if (cmdToEdit.response.startsWith('[pref]')) return message.channel.send({embed: errEmbed});
            let changeToValue = collected[questions.length - 1]?.content;
            errEmbed.description = 'no bad words!';
            if (SecretJSON.find(bw => changeToValue.split(" ").includes(bw))) return message.channel.send({embed: errEmbed});
            switch(collected[1].content.toLowerCase())
            {
                case 'trigger', 't', 'trig':
                    errEmbed.description = 'the trigger has to be a string.';
                    if (!changeToValue) return message.channel.send({embed: errEmbed});
                    if (!cmdToEdit.edits) cmdToEdit.edits = [];
                    cmdToEdit.edits.push({type: 'trigger', author: message.author.id, time: new Date().getTime(), prevVal: cmdToEdit.name});
                    succEmbed.description += `trigger of "${cmdToEdit.name}" has been changed to "${changeToValue}"`;
                    cmdToEdit.name = changeToValue;
                    break;
                case 'response', 'r', 'res':
                    if (collected[questions.length - 1].attachments)
                    collected[questions.length - 1].attachments.each(attachment => changeToValue += ` ${attachment.url}`);
                    errEmbed.description = 'use the alias command...';
                    if (changeToValue.startsWith('[pref]')) return message.channel.send({embed: errEmbed});
                    succEmbed.description = `response of "${cmdToEdit.name}" has been changed to "${changeToValue}"`;
                    if (!cmdToEdit.edits) cmdToEdit.edits = [];
                    cmdToEdit.edits.push({type: 'response', author: message.author.id, time: new Date().getTime(), prevVal: cmdToEdit.response});
                    cmdToEdit.response = changeToValue;
                case 'd', 'del', 'delete':
                    errEmbed.description = 'you can only delete a command if you are the server owner or made the command.';
                    if ((message.author.id !== cmdToEdit.author) || (message.author.id !== message.guild.ownerID)) return message.channel.send({embed: errEmbed});
                    succEmbed.description = `${cmdToEdit.name} command has been deleted.`;
                    ServerJSON[message.guild.id].cmds.splice(ServerJSON[message.guild.id].cmds.indexOf(cmdToEdit), 1);
                    break;
                default:
                    errEmbed.description = 'that\'s not a valid response, please try again.';
                    return message.channel.send({embed: errEmbed});
            }
            fs.writeFileSync('./DB/servers.json', JSON.stringify(ServerJSON, null, 2));
            return message.channel.send({embed: succEmbed});
        });
    }
}