const dateFormat = require('dateformat');

let errEmbed = {color: global.orangeCol, title: 'error', description: 'please specify an emoji', footer: global.footer};
const bth = { false: 'no', true: 'yes' };

module.exports =
{
    name: ['emoji'], description: 'displays info about an emoji', usage: '[pref]emoji <emoji>\nexample: [pref]emoji <:john:822616260638408724>', note: 'this does **not** work with default emoji, like :no_mouth:',
    async execute(message, args, bot)
    {
        if (!args[1]) return message.channel.send({embed:errEmbed});
        if (args[1].match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/))
        {
            let emojiCache = bot.emojis.cache;
            let emojiId = args[1].slice( args[1].lastIndexOf(":"), args[1].lastIndexOf(">")).slice(1);
            let emoj = emojiCache.get(emojiId);
            let oopEmbed =
            {
                color: global.orangeCol, title: `oops!`,
                thumbnail: {url: `https://discordapp.com/emojis/${emojiId}.gif`},
                description: 'sorry, i couldn\'t find that emoji, so i can\'t fetch all of its info.\nit will appear as a thumnbail if it is animated', 
                image: {url: `https://discordapp.com/emojis/${emojiId}.png` },
                fields: [ { name: 'id', value: emojiId } ], footer: global.footer
            };
            if ((!emoj) || (!emoj.available)) return message.channel.send({embed:oopEmbed});
            let initAuthor = await(emoj.fetchAuthor());
            if (message.guild.member(initAuthor)) initAuthor = message.guild.member(initAuthor);
            else initAuthor = initAuthor.username;
            x = Date.now() - emoj.createdTimestamp;
            h = Math.floor(x / 86400000);
            let embed =
            {
                color: global.blueCol, title: emoj.name, image: {url: emoj.url},
                fields:
                [
                    { name: 'date created', value: `${h} days ago\n${dateFormat(emoj.createdAt, 'default', true)} UTC`},
                    { name: 'id', value: emoj.id}, {name: 'does it require colons?', value: bth[emoj.requiresColons ] },
                    { name: 'author', value: initAuthor } ], footer: global.footer
            };
            if (emoj.roles.cache.size > 0)
            {
                let h = emoj.roles.cache.array().sort((a, b) => a.position - b.position);
                let rolesStr = '';
                let strToAddAtTheEnd = '';
                if (h.length > 15)
                {
                    h = h.slice(0, 15);
                    strToAddAtTheEnd = ` and ${emoj.roles.cache.size - 15} more...`;
                }
                h.forEach(r => rolesStr += `${r}\n`);
                embed.fields.push({name: `roles that can use this emoji (${emoj.roles.cache.size})`, value: `${rolesStr}${strToAddAtTheEnd}`});
            }
            return message.channel.send({embed:embed});
        }
    }
}