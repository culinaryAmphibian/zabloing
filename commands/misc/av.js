let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'av', description: 'fetches profile pictures',
    execute(message, args, UserJSON)
    {
        let img;
        let name;
        let url;
        let mentioned = message.mentions.members.first();
        if (mentioned)
        {
            img = mentioned.user.displayAvatarURL({dynamic:true, size: 4096});
            name = mentioned.user.username;
            url = `https://cdn.discordapp.com/avatars/${mentioned.user.id}/${mentioned.user.avatar}?size=4096`;
        }
        if (args[1] && (!mentioned))
        {
            if (UserJSON[args[1]])
            {
                let kid = UserJSON[args[1]];
                img = kid.pfp;
                name = kid.name;
                url = `https://cdn.discordapp.com/avatars/${args[1]}/${kid.avatarHash}?size=4096`;
            } else return message.channel.send('could not find that user in the database. please try again after they have sent a message.');
        } else if ((!mentioned) && (!args[1]))
        {
            img = message.author.displayAvatarURL({dynamic:true, size:4096});
            name = message.author.username;
            url = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}?size=4096`;
        }
        let avEmbed = {color: blueCol, title: `${name}'s avatar`, url: url, image: {url:img}, footer: {text: global.eft, icon_url:global.efi}};
        message.channel.send({embed:avEmbed});
        return;
    }
}