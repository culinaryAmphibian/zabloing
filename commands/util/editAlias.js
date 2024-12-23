const Discord = require('discord.js');
const fs = require('fs');
const SecretJSON = require('../../DB/secret.json').badWords;
const ServerJSON = require('../../DB/servers.json');

let errEmbed = {color: global.orange, title: 'error', description: 'this server doesn\'t have any aliases.', footer: global.footer};
let succEmbed = {color: global.blue, title: 'success', description: 'the ', footer: global.footer};

const questions = ['what alias do you want to modify?', 'do you want to modify the alias name or command, or delete the alias?', 'what do you want to change it to?'];

module.exports =
{
    name: ['editalias'], description: 'edits aliases',
    execute(message, args, bot)
    {

        let aliases = ServerJSON[message.guild.id].cmds?.filter?.(c => c.response.startsWith('[pref]'));
        if (!aliases) return message.channel.send({embeds: [errEmbed]});
        errEmbed.description = 'you must have the permission to manage messages.';
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send({embeds: [errEmbed]});
        const filter = m => m.content && (m.author.id == message.author.id);
        let counter = 0;
        const collector = new Discord.MessageCollector(message.channel, filter, {max: questions.length});
        message.channel.send(questions[counter++]);
        collector.on('collect', () => {if (counter < questions.length) message.channel.send(questions[counter++])});
        collector.on('end', collected =>
        {
            collected = collected.map(m => m.content);
            errEmbed.description = 'you did not answer all the questions!';
            if (collected.length < questions.length) return message.channel.send({embeds: [errEmbed]});
            let aliasToEdit = aliases.find(a => a.response.slice('[pref]'.length) == collected[0]);
            errEmbed.description = 'sorry, i couldn\'t find that alias.';
            if (!aliasToEdit) return message.channel.send({embeds: [errEmbed]});
            let changeToValue = collected[collected.length - 1];
            let mentioned = collected.slice(1).join(' ').split(' ').find(a => a.match(/<(@!?|@&)?\d{17,19}/g) || a.match(/@(everyone|here)/g));
            if (mentioned) mentioned.forEach(m => m.content = m.content.split(' ').filter(c => !c.match(/<(@!?|@&)?\d{17,19}/g) && !c.match(/@(everyone|here)/g).join(' ')));
            errEmbed.description = 'no profanity!';
            if (SecretJSON.find(bw => collected.join(' ').split(' ').includes(bw))) return message.channel.send({embeds: [errEmbed]});
            errEmbed.description = 'sorry, i couldn\'t find that command.';
            switch(collected[1])
            {
                case 'name', 'n':
                    if (!aliasToEdit.edits) aliasToEdit.edits = [];
                    aliasToEdit.edits.push({type: 'name', author: message.author.id, time: new Date().getTime(), prevVal: aliasToEdit.name});
                    succEmbed.description = `name of ${aliasToEdit.name} has been changed to ${changeToValue}.`;
                    aliasToEdit.name = changeToValue;
                    break;
                case 'command', 'cmd', 'c':
                    if (!aliasToEdit.edits) aliasToEdit.edits = [];
                    aliasToEdit.edits.push({type: 'command', author: message.author.id, time: new Date().getTime(), prevVal: aliasToEdit.response});
                    succEmbed.description = `response of ${aliasToEdit.name.slice('[pref]'.length)} has been changed to ${changeToValue}.`;
                    aliasToEdit.response = changeToValue;
                    break;
                case 'delete', 'del', 'd':
                    errEmbed.description = 'you can only delete an alias if you are the server owner or made the alias.';
                    if ((message.author.id !== aliasToEdit.author) || (message.author.id !== message.guild.ownerID)) return message.channel.send({embeds: [errEmbed]});
                    succEmbed.description = `${aliasToEdit.name} alias has been deleted.`;
                    ServerJSON[message.guild.id].cmds.splice(ServerJSON[message.guild.id].cmds.indexOf(aliasToEdit), 1);
                    break;
                default:
                    errEmbed.description = 'that\'s not an accepted value to modify.';
                    return message.channel.send({embeds: [errEmbed]});
            }
            fs.writeFileSync('./DB/servers.json', JSON.stringify(ServerJSON, null, 2));
            return message.channel.send({embeds: [succEmbed]});
        });      
    }
}