const fs = require('fs');
const { currency } = require('../../DB/config.json');
const UserJSON = require('../../DB/users.json');
const when = require('../util/when');

let succEmbed = { color: global.green, title: `success`, description: ``, footer: global.footer };
let errEmbed = { color: global.orange, title: `error`, description: ``, footer: global.footer };
const dailyAward = 50;
const dayMs = 1000 * 60 * 60 * 24;
module.exports =
{
    name: ['daily'], description: `claims your daily reward of [curr]`,
    execute(message) {
        const authorData = UserJSON[message.author.id];
        if (!authorData.games.lastClaimedDaily)
            UserJSON[message.author.id].lastClaimedDaily = new Date().getTime() - dayMs;
        errEmbed.description = `you have already claimed in the last 24 hours.\n` +
                            `you can claim again in ` + 
                            when(authorData.games.lastClaimedDaily + dayMs - new Date().getTime());
        if ((new Date().getTime() - authorData.games.lastClaimedDaily) < dayMs)
            return message.channel.send({embeds:[errEmbed]});
        UserJSON[message.author.id].games.bal += dailyAward;
        UserJSON[message.author.id].games.lastClaimedDaily = new Date().getTime();
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        succEmbed.description = `nice, you earned ${dailyAward} ${currency}.` + 
                            `your balance is now ${authorData.games.bal} ${currency}`;
        return message.channel.send({embeds:[succEmbed]});
    }
}