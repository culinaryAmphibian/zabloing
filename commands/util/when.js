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

const when = (ms, ago) =>
{
    let arr = [];
    let years = Math.floor(ms/yr);
    if (years >= 1) arr.push(`${years} year${weirdS(years)}`);
    ms -= years * yr;
    let months = Math.floor(ms/mo);
    if (months >= 1) arr.push(`${months} month${weirdS(months)}`);
    ms -= months * mo;
    let weeks = Math.floor(ms/wk);
    if (weeks >= 1) arr.push(`${weeks} week${weirdS(weeks)}`);
    ms -= weeks * wk;
    let days = Math.floor(ms/dy);
    if (days >= 1) arr.push(`${days} day${weirdS(days)}`);
    ms -= days * dy;
    let hours = Math.floor(ms/hr);
    if (hours >= 1) arr.push(`${hours} hour${weirdS(hours)}`);
    ms -= hours * hr;
    let minutes = Math.floor(ms/min);
    if (minutes >= 1) arr.push(`${minutes} minute${weirdS(minutes)}`);
    ms -= minutes * min;
    let seconds = Math.floor(ms/sec);
    if (seconds >= 1) arr.push(`${seconds} seconds`);
    ms -= seconds * sec;
    let milliseconds = Math.floor(ms/msec);
    if (milliseconds >= 1) arr.push(`${milliseconds} milliseconds`);

    let final;

    if (arr.length > 2) final = `${arr.slice(0, -1).join(', ')}, and ${arr.pop()}`;
    else if (arr.length == 2) final = `${arr.slice(0, -1).join(', ')} and ${arr.pop()}`;
    else final = arr.pop();

    if (ago) return final + ' ago';
    return final;
}

module.exports = when;