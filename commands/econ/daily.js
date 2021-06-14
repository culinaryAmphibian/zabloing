const fs = require('fs');
const ConfigJSON = require('../../DB/config.json');
const UserJSON = require('../../DB/users.json');

function weirdS(num)
{
    if (num == 1) return '';
    else return 's';
}

function yearsDaysMinutes(msDiff)
{
    let seconds = Math.round(msDiff/1000);
    let minutes = Math.round(seconds/60);
    let hours = Math.round(minutes/60);
    if (hours > 0) return `${hours} hour${weirdS(hours)} (${minutes} minutes)`;
    else if (minutes > 0) return `${minutes} minute${weirdS(minutes)} (${seconds} seconds)`;
    else return `${seconds} second${weirdS(seconds)} (${msDiff} milliseconds)`;
}

let succEmbed = { color: global.greenCol, title: `success`, description: ``, footer: global.footer };
let errEmbed = { color: global.orangeCol, title: `error`, description: ``, footer: global.footer };
const dailyAward = 50;

module.exports =
{
    name: ['daily'], description: `claims your daily reward of [curr]`,
    execute(message)
    {
        if (!UserJSON[message.author.id].games.lastClaimedDaily) UserJSON[message.author.id].lastClaimedDaily = new Date().getTime() - (1000 * 60 * 60 * 24);
        errEmbed.description = `you have already claimed in the last 24 hours.\nyou can claim again in ${yearsDaysMinutes(UserJSON[message.author.id].games.lastClaimedDaily + (1000 * 60 * 60 * 24) - new Date().getTime())}`;
        if ((new Date().getTime() - UserJSON[message.author.id].games.lastClaimedDaily) < (1000 * 60 * 60 * 24)) return message.channel.send({embed:errEmbed});
        UserJSON[message.author.id].games.bal += dailyAward;
        UserJSON[message.author.id].games.lastClaimedDaily = new Date().getTime();
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        succEmbed.description = `nice, you earned ${dailyAward} ${ConfigJSON.currency}. your balance is now ${UserJSON[message.author.id].games.bal} ${ConfigJSON.currency}`;
        return message.channel.send({embed:succEmbed});
    }
}