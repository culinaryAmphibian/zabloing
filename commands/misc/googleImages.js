const img = require('images-scraper');
const google = new img({puppeteer:{headless:true}});
const fs = require('fs');
const UserJSON = require('../../DB/users.json');
const config = require('../../DB/config.json');
const cooldown = config["cooldowns"].misc.googleImages;

module.exports =
{
    name: 'googleImages', description: 'searches google images',
    async execute(message, args)
    {
        let subtraction = (new Date().getTime() - UserJSON[message.author.id].cooldowns.googleImages);
        let minTime = (cooldown - subtraction)/1000;
        if (subtraction < cooldown) return channel.send(`you can play again in ${Math.round(minTime)} seconds.`);
        if (args.length < 2) return message.channel.send('please enter a search query');
        let query = args.slice(1);
        let results = await google.scrape(query, 4);
        message.channel.send(results[Math.floor(Math.random() * results.length)].url);
        UserJSON[message.author.id].cooldowns.googleImages = new Date().getTime();
        return fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
    }
}