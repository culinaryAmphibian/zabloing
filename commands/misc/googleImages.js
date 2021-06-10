const img = require('images-scraper');
const google = new img({puppeteer:{headless:true}});
const fs = require('fs');
const UserJSON = require('../../DB/users.json');
const config = require('../../DB/config.json');
const secretJSON = require('../../DB/secret.json');
const cooldown = config["cooldowns"].misc.googleImages;

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

let errEmbed = {color: orangeCol, title: 'error', description: '', footer: global.footer};

module.exports =
{
    name: ['image'], description: 'fetches an image from google images', usage: '[pref]image <query>\nexample: [pref]image goose',
    note: `this command takes a few seconds to return an image, so it has a cooldown of ${Math.round(cooldown/1000)} seconds.\nthis command is family friendly, so it won\'t work if the query contains a bad word.`,
    async execute(message, args)
    {
        let subtraction = (new Date().getTime() - UserJSON[message.author.id].cooldowns.googleImages);
        let minTime = (cooldown - subtraction)/1000;
        errEmbed.description = `you can play again in ${Math.round(minTime)} seconds.`;
        if (subtraction < cooldown) return channel.send({embed:errEmbed});
        errEmbed.description = 'please enter a search query';
        if (!args[1]) return message.channel.send({embed:errEmbed});
        let query = args.slice(1).join(" ");
        errEmbed.description = 'your query contained a bad word >:(';
        if (secretJSON.badWords.find(badWord => query.includes(badWord))) return message.channel.send({embed:errEmbed});
        let results = await google.scrape(query, 4);
        message.channel.send(results[Math.floor(Math.random() * results.length)].url);
        UserJSON[message.author.id].cooldowns.googleImages = new Date().getTime();
        return fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
    }
}