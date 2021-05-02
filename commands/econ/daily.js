const fs = require('fs');

let r = ((Math.floor(Math.random() * 50)) + 1);
let g = (((Math.floor(Math.random() * 54)) + 1)) + 200;
let b = ((Math.floor(Math.random() * 40)) + 40);
greenCol = [r,g,b];

r = (Math.floor(Math.random() * 25) + 1) + 230;
g = 100 + (Math.floor(Math.random() * 40) + 1);
b = (Math.floor(Math.random() * 35) + 1)
orangeCol = [r,g,b];

function weirdS(num)
{
    if (num == 1) return '';
    else return 's';
}

function yearsDaysMinutes(msDiff)
{
    let seconds = Math.round(msDiff/1000);
    let minutes = Math.floor(seconds/60);
    let hours = Math.floor(minutes/60);
    let days = Math.floor(hours/24);
    if (days > 0) return `${days} day${weirdS(days)} (${hours} hours)`;
    else if (hours > 0) return `${hours} hour${weirdS(hours)} (${minutes} minutes)`;
    else if (minutes > 0) return `${minutes} minute${weirdS(minutes)} (${seconds} seconds)`;
    else return `${seconds} second${weirdS(seconds)} (${msDiff} milliseconds)`;
}

const dailyAward = 50;

module.exports =
{
    name: 'daily', description: 'pays a user a certain amount per day if they claim it',
    execute(message, UserJSON)
    {
        let succEmbed = { color: greenCol, title: `success`, description: ``, footer: { text: global.eft, icon_url: global.efi } };
        let errEmbed = { color: orangeCol, title: `error`, description: ``, footer: { text: global.eft, icon_url: global.efi } };
        if (!UserJSON[message.author.id].games.lastClaimedDaily) UserJSON[message.author.id].lastClaimedDaily = new Date().getTime() - (1000 * 60 * 60 * 24);
        errEmbed.description = `you have already claimed in the last 24 hours. you can claim again in ${yearsDaysMinutes(new Date().getTime() - UserJSON[message.author.id].games.lastClaimedDaily)}`;
        if (UserJSON[message.author.id].games.lastClaimedDaily < ( (1000 * 60 * 60 * 24) - 1)) return message.channel.send({embed:errEmbed});
        UserJSON[message.author.id].games.bal += dailyAward;
        UserJSON[message.author.id].games.lastClaimedDaily = new Date().getTime();
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        succEmbed.description = `nice, you earned ${dailyAward} ${global.currency}. your balance is now ${UserJSON[message.author.id].games.bal} ${global.currency}`;
        return message.channel.send({embed:succEmbed});
    }
}