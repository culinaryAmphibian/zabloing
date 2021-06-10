const Discord = require('discord.js');
const fs = require('fs');
const ConfigJSON = require('../../DB/config.json');
const SecretJSON = require('../../DB/secret.json');
const UserJSON = require('../../DB/users.json');

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

function weirdS(num)
{
    if (num == 1) return;
    else return 's';
}

function yearsDaysMinutes(msDiff)
{
    let seconds = Math.round(msDiff/1000);
    let minutes = Math.floor(seconds/60);
    let hours = Math.floor(minutes/60);
    if (hours > 0) return `${hours} hour${weirdS(hours)} (${minutes} minutes)`;
    else if (minutes > 0) return `${minutes} minute${weirdS(minutes)} (${seconds} seconds)`;
    else return `${seconds} second${weirdS(seconds)} (${msDiff} milliseconds)`;
}

const questions = ['what command gave you the issue', 'what happened? it would be helpful if you gave a description and/or a screenshot. thanks!', 'thanks for reporting the issue! i\'ll be on it straight away!'];
let errEmbed = {color: orangeCol, title: 'error', description: '', footer: global.footer};
let queue = ConfigJSON.reports;

module.exports =
{
    name: ['report'], description: 'allows you to report a broken function of the bot',
    note: 'there is a 1-hour cooldown per member so that i don\'t get spammed;\nyou will get a [curr] reward for reporting the bug depening on its criticality',
    async execute(message, args, bot)
    {
        if (!UserJSON[message.author.id].lastReport) UserJSON[message.author.id].lastReport = new Date().getTime() - (1000 * 60 * 60);
        if (!UserJSON[message.author.id].reportCount) UserJSON[message.author.id].reportCount = 0;
        errEmbed.description = `you have already reported in the last hour.\nyou can report again in ${yearsDaysMinutes(UserJSON[message.author.id].lastReport + (1000 * 60 * 60) - new Date().getTime())}`;
        if ((new Date().getTime()) - UserJSON[message.author.id].lastReport < (1000 * 60 * 60)) return message.channel.send({embed:errEmbed});
        UserJSON[message.author.id].lastReport = new Date().getTime();
        UserJSON[message.author.id].reportCount++;
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        let counter = 0;
        message.channel.send(questions[counter++]);
        const filter = m => m.author.id == message.author.id;
        const collector = new Discord.MessageCollector(message.channel, filter, {max: questions.length - 1});
        collector.on('collect', () => message.channel.send(questions[counter++]));
        collector.on('end', async(collected) =>
        {
            let embed = {color: orangeCol, title: `problem with the ${collected.first().content} command by ${collected.first().author.id}`,
            description: `reported by ${collected.first().author.tag}\nin ${collected.first().guild.id} owned by ${collected.first().guild.owner.user.tag}.`,
            fields: [], footer: global.footer};
            counter = 0;
            collected.each(m =>
            {
                if (m.content?.length > 0) embed.fields.push({name: questions[counter++], value: m.content})
            });
            let attachArr = [];
            if (collected.find(m => m.attachments.size > 0))
            {
                collected.filter(m => m.attachments).each(m => m.attachments.each(a => attachArr.push(a.url)));
                if (attachArr.length == 1) embed.image = {url: attachArr.pop()};
            }
            queue.push(embed);
            if (attachArr[0]) queue.push(attachArr);
            fs.writeFileSync('./DB/config.json', JSON.stringify(ConfigJSON, null, 2));
        });
        const me = await bot.users.fetch(SecretJSON.ownerId, true, true);
        let meCh;
        setInterval(async function()
        {
            if (queue[0])
            {
                if (queue[0].description) meCh = await me.send({embed:queue.shift()});
                if (queue[0]?.length) me.send({files:queue.shift()});
                fs.writeFileSync('./DB/config.json', JSON.stringify(ConfigJSON, null, 2));
            }
        }, (1000 * 60 * 10));
    }
}