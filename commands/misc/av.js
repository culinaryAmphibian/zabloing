let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

const search = require('discord.js-search');

function embd(blueCol, name, url, img, message)
{
    let avEmbed = {color: blueCol, title: `${name}'s avatar`, url: url, image: {url:img}, footer: {text: global.eft, icon_url:global.efi}};
    return message.channel.send({embed:avEmbed});
}

module.exports =
{
    name: 'av', description: 'fetches profile pictures',
    execute(message, args, prefix)
    {
        let img;
        let name;
        let url;
        let mentioned = message.mentions.members.first();
        if (mentioned)
        {
            img = mentioned.user.displayAvatarURL({dynamic:true, size: 4096});
            name = mentioned.user.username;
            url = `https://cdn.discordapp.com/avatars/${mentioned.user.id}/${mentioned.user.avatar}.png?size=4096`;
            embd(blueCol, name, url, img, message);
        }
        else if (args[1])
        {
            // search.searchMember(query).then(x =>
            // {
            //     img = ;
            //     name = x.user.username;
            //     url = 
            // });
            let query = args.join(" ").substr(args[0].length + 1);
            search.searchMember(message, query, true).then(x =>
                {
                    img = x.user.displayAvatarURL({dynamic:true, size:4096});
                    name = x.user.username;
                    url = `https://cdn.discordapp.com/avatars/${x.user.id}/${x.user.avatar}.png?size=4096`;
                    embd(blueCol, name, url, img, message);
                })
        } else
        {
            img = message.author.displayAvatarURL({dynamic:true, size:4096});
            name = message.author.username;
            url = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=4096`;
            embd(blueCol, name, url, img, message);
        }
    }
}