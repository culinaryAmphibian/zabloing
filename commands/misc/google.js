const google = require('google-it');
const SecretJSON = require('../../DB/secret.json');

google.protocol = 'https';
google.resultsPerPage = 5;

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

let errEmbed = {color: orangeCol, title: 'error', description: 'please specify a search query', footer: global.footer};

module.exports =
{
    name: ['google'], description: 'googles a query', usage: '[pref]google <query>\nexample: [pref]google gaming', note: 'this command is family friendly, and won\'t work if the query contains a bad word.',
    async execute(message, args)
    {
        let embed = {color: blueCol, title: 'google search results for ', description: '', fields: [], footer: global.footer};
        let query = args.slice(1).join(" ");
        if (!query) return message.channel.send({embed:errEmbed});
        if (SecretJSON.badWords.find(badWord => query.includes(badWord))) return message.channel.send('no profanity!');
        let search = await google({'query': query, 'limit': 5, 'disableConsole': true});
        embed.title += `"${query}"`;
        embed.description = `${search.length} results`;
        search.forEach(i => embed.fields.push({name: i.title, value: `[link](${i.link}) - ${i.snippet}`}));
        return message.channel.send({embed:embed});
    }
}