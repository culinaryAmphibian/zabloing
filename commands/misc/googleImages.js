const gis = require('g-i-s');
const fs = require('fs');
const UserJSON = require('../../DB/users.json');
const cooldown = require('../../DB/config.json').cooldowns.misc.googleImages;
const secretJSON = require('../../DB/secret.json');

let errEmbed = {color: global.orange, title: 'error', description: '', footer: global.footer};

module.exports =
{
    name: ['image'], description: 'fetches an image from google images', usage: '[pref]image <query>\nexample: [pref]image goose',
    note: `this command takes a few seconds to return an image, so it has a cooldown of ${Math.round(cooldown/1000)} seconds.\nthis command is family friendly, so it won\'t work if the query contains a bad word.`,
    async execute(message, args)
    {
        let subtraction = (new Date().getTime() - UserJSON[message.author.id].cooldowns.googleImages);
        let minTime = (cooldown - subtraction)/1000;
        errEmbed.description = `you can play again in ${Math.round(minTime)} seconds.`;
        if (subtraction < cooldown) return channel.send({embeds:[errEmbed]});
        errEmbed.description = 'please enter a search query';
        if (!args[1]) return message.channel.send({embeds:[errEmbed]});
        let query = args.slice(1).join(" ");
        errEmbed.description = 'your query contained a bad word >:(';
        if (secretJSON.badWords.find(badWord => query.includes(badWord))) return message.channel.send({embeds:[errEmbed]});
        gis(query, res);
        function res(error, results)
        {
            errEmbed.description = 'sorry, an error occurred.';
            if (error) return message.channel.send({embeds: [errEmbed]});
            message.channel.send(results[Math.floor(Math.random() * 5)].url);
        }
        UserJSON[message.author.id].cooldowns.googleImages = new Date().getTime();
        return fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
    }
}