const img = require('images-scraper');
const google = new img({puppeteer:{headless:true}});
const fs = require('fs');
const UserJSON = require('../../DB/users.json');
const config = require('../../DB/config.json');
const cooldown = config["cooldowns"].misc.googleImages;

function coolDown(id)
{
    if (!UserJSON[id].cooldowns.googleImages) UserJSON[id].cooldowns.googleImages = 0;
    if ( ( new Date().getTime() - UserJSON[id].cooldowns.googleImages ) > cooldown ) return 'h';
    UserJSON[id].cooldowns.googleImages = new Date().getTime();
    return fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
}

module.exports =
{
    name: 'googleImages', description: 'searches google images',
    async execute(message, args)
    {
        if (coolDown(message.author.id) == 'h') return message.channel.send(`please wait another ${ Math.round((new Date().getTime() - UserJSON[message.author.id].cooldowns.googleImages)/1000) } seconds.`);
        if (args.length < 2) return message.channel.send('please enter a search query');
        let query = args.slice(1);
        let results = await google.scrape(query, 4);
        return message.channel.send(results[Math.floor(Math.random() * results.length)].url);
    }
}