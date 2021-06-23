const Discord = require('discord.js');
const fs = require('fs');
const ConfigJSON = require('../../DB/config.json');
const SecretJSON = require('../../DB/secret.json');
const UserJSON = require('../../DB/users.json');

let b = 1;

const wk = 1000 * 60 * 60 * 24 * 7;
const dy = wk/7;
const hr = dy/24;
const min = hr/60;
const sec = min/60;
const msec = sec/1000;

function weirdS(num)
{
    if (num != 1) return 's';
    return '';
}

function when(ms)
{
    let arr = [];
    let minutes = Math.floor(ms/min);
    if (minutes >= 1) arr.push(`${minutes} minute${weirdS(minutes)}`);
    ms -= minutes * min;
    let seconds = Math.floor(ms/sec);
    if (seconds >= 1) arr.push(`${seconds} second${weirdS(seconds)}`);
    ms -= seconds * sec;
    let milliseconds = Math.floor(ms/msec);
    if (milliseconds >= 1) arr.push(`${milliseconds} millisecond${weirdS(milliseconds)}`);

    if (arr.length > 2) return `${arr.slice(0, -1).join(', ')}, and ${arr.pop()}`;
    if (arr.length > 1) return `${arr.slice(0, -1).join(', ')} and ${arr.pop()}`;
    return arr.pop();
}

function suggestAndRespond(content, author, channel, embed, ch)
{
    embed.color = global.orangeCol;
    embed.title = 'error';
    embed.description = 'your suggestion message didn\'t have any words!';
    if (!content)
    {
        b = 0;
        return message.channel.send({embed:embed});
    }
    embed.description = 'your suggestion has a bad word!';
    if (SecretJSON.badWords.find(bw => content.toLowerCase().split(" ").includes(bw)))
    {
        b = 0;
        return channel.send({embed:embed});
    }
    embed.color = global.greenCol;
    embed.title = `suggestion #${ConfigJSON.suggestions.count + 1} from ${author.username}`;
    embed.description = `"${content}"`;
    ch.send({embed:embed});
    embed.title = `thanks!`;
    embed.description = 'your suggestion will be evaluated shortly.';
    channel.send({embed:embed});
}

const questions = ['what would you like to suggest?', 'thanks for your suggestion!'];
let errEmbed = {color: global.orangeCol, title: 'error', description: '', footer: global.footer};
let suggestEmbed = {color: global.greenCol, title: '', description: '', footer: global.footer};

module.exports =
{
    name: ['suggest'], description: 'allows you to suggest bot features', note: 'there is a 10 minute time limit per user.',
    execute(message, args, bot)
    {
        if (!UserJSON[message.author.id].lastSuggest) UserJSON[message.author.id].lastSuggest = new Date().getTime() - (1000 * 60 * 10);
        if (!UserJSON[message.author.id].suggestCount) UserJSON[message.author.id].suggestCount = 0;
        errEmbed.description = `you have already suggested in the last 10 minutes.\nyou can suggest again in ${when(UserJSON[message.author.id].lastSuggest + (1000 * 60 * 10) - new Date().getTime())}`;
        if ((new Date().getTime()) - UserJSON[message.author.id].lastSuggest < (1000 * 60 * 10)) return message.channel.send({embed:errEmbed}); 
        UserJSON[message.author.id].suggestCount++;
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        let ch = bot.channels.cache.get(ConfigJSON.suggestions.channel);
        if (!args[1])
        {
            const filter = m => m.author.id == message.author.id;
            const collector = new Discord.MessageCollector(message.channel, filter, {max: questions.length - 1});
            let counter = 0;
            message.channel.send(questions[counter++]);
            collector.on('collect', () =>
            {
                message.channel.send(questions[counter++]);
                collector.stop();
            });
            collector.on('end', collected => suggestAndRespond(collected.first().content, collected.first().author, message.channel, suggestEmbed, ch));
        } else
        {
            let content = args.slice(1).join(" ");
            suggestAndRespond(content, message.author, message.channel, suggestEmbed, ch);
        }
        if (b = 0) return b = 1;
        ConfigJSON.suggestions.count++;
        fs.writeFileSync('./DB/config.json', JSON.stringify(ConfigJSON, null, 2));
    }
}