const fs = require('fs');

let r = ((Math.floor(Math.random() * 50)) + 1);
let g = (((Math.floor(Math.random() * 54)) + 1)) + 200;
let b = ((Math.floor(Math.random() * 40)) + 40);
greenCol = [r,g,b];

r = (Math.floor(Math.random() * 25) + 1) + 230;
g = 100 + (Math.floor(Math.random() * 40) + 1);
b = (Math.floor(Math.random() * 35) + 1)
orangeCol = [r,g,b];
module.exports =
{
    name: 'bal',
    execute(message, args, UserJSON, bot)
    {
        let embed = { color: greenCol, title: ``, footer: { text: global.eft, icon_url: global.efi } };
        let mentioned = message.mentions.members.first();
        if (mentioned)
        {
            embed.title = `${mentioned.user.username} has ${UserJSON[mentioned.id].games.bal} points.`;
            if (!UserJSON[mentioned.id])
            {
                bot.util.get('newUser').execute(message, mentioned.user, mentioned.id);
                embed.title = `${mentioned.user.username} has ${UserJSON[mentioned.id].games.bal} points.`;
                if (mentioned.bot)
                {
                    embed.color = orangeCol;
                    embed.title = `the mentioned user is a bot an cannot play the game.`;
                }
            }
        }
        else if (args[1])
        {
            return;
        }
        else
        {
            embed.title = `you have ${UserJSON[message.author.id].games.bal} points.`;
        }
        return message.channel.send({embed:embed})
    }
}