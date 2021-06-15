const fs = require('fs');
const ConfigJSON = require('../../DB/config.json');
const UserJSON = require('../../DB/users.json');

const yr = 1000 * 60 * 60 * 24 * 365;
const mo = yr/12;
const wk = 1000 * 60 * 60 * 24 * 7;
const dy = wk/7;
const hr = dy/24;
const min = hr/60;
const sec = min/60;
const msec = sec/1000;

function weirdS(num)
{
    if (num != 1) return 's';
    return '';
}

function when(ms)
{
    let days = Math.floor(ms/dy);
    if (days >= 1) arr.push(`${days} day${weirdS(days)}`);
    let hours = Math.floor((ms - (days * dy))/hr);
    if (hours >= 1) arr.push(`${hours} hour${weirdS(hours)}`);
    let minutes = Math.floor((ms - ((days * dy) + (hours * hr)))/min);
    if (minutes >= 1) arr.push(`${minutes} minute${weirdS(minutes)}`);
    let seconds = Math.floor((ms - ((days * dy) + (hours * hr) + (minutes * min)))/sec);
    if (seconds >= 1) arr.push(`${seconds} second${weirdS(seconds)}`);
    let milliseconds = Math.floor((ms - ((days * dy) + (hours * hr) + (minutes * min) + (seconds * sec)))/msec);
    if (milliseconds >= 1) arr.push(`${milliseconds} millisecond${weirdS(milliseconds)}`);

    if (arr.length > 2) return `${arr.slice(0, -1).join(', ')}, and ${arr.pop()}`;
    if (arr.length > 1) return `${arr.slice(0, -1).join(', ')} and ${arr.pop()}`;
    return arr.pop();
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
        errEmbed.description = `you have already claimed in the last 24 hours.\nyou can claim again in ${when(UserJSON[message.author.id].games.lastClaimedDaily + (1000 * 60 * 60 * 24) - new Date().getTime())}`;
        if ((new Date().getTime() - UserJSON[message.author.id].games.lastClaimedDaily) < (1000 * 60 * 60 * 24)) return message.channel.send({embed:errEmbed});
        UserJSON[message.author.id].games.bal += dailyAward;
        UserJSON[message.author.id].games.lastClaimedDaily = new Date().getTime();
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        succEmbed.description = `nice, you earned ${dailyAward} ${ConfigJSON.currency}. your balance is now ${UserJSON[message.author.id].games.bal} ${ConfigJSON.currency}`;
        return message.channel.send({embed:succEmbed});
    }
}