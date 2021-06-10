const ConfigJSON = require('../../DB/config.json');
const UserJSON = require('../../DB/users.json');

let g_r = (Math.floor(Math.random() * 50)) + 1;
let g_g = ((Math.floor(Math.random() * 54)) + 1) + 200;
let g_b = (Math.floor(Math.random() * 40)) + 40;
let greenCol = [g_r,g_g,g_b];

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

let errorEmbed = {color: orangeCol, title: 'error', description: '', footer: global.footer};

module.exports =
{
    name: ['lb', 'leaderboard'], description: 'displays the server\'s leaderboard', usage: '[pref]lb ?<w/l, played>\nexample: [pref]lb played', note: 'the optional parameter defaults to sorting by [curr]',
    async execute(message, args)
    {
        let lbString = '';
        let counter = 1;
        let title;
        let allMembers = await(message.guild.members.fetch(true));
        let h = Object.entries(UserJSON);
        var filtered = h.filter(a => a[1].servers.includes(message.guild.id))
            .filter(a => a[1].games);
        if ( (!args[1]) || (args[1] == `${ConfigJSON.currency}`) )
        {
            title = `total ${ConfigJSON.currency}`;
            let fin = filtered.filter(a => a[1].games.bal > 0);
            errorEmbed.description = 'no players with a balance higher than 0 were found in this server :(';
            if (fin.length < 1) return message.channel.send({embed:errorEmbed});
            if (fin.length > 10) fin = fin.slice(0, 10);
            fin = fin.sort((a, b) => b[1].games.bal - a[1].games.bal);
            fin.forEach(m =>
            {
                let ment = allMembers.get(m[0]);
                lbString += `${counter++}. ${ment} - ${m[1].games.bal}\n`;
            });
        } else if (args[1] == 'played')
        {
            title = `total games played`;
            let fin = filtered.filter(a => a[1].games.hangman).filter(a => a[1].games.hangman.gamesPlayed > 0);
            errorEmbed.description = 'no players that have played a game were found in this server :(';
            if (fin.length < 1) return message.channel.send({embed:errorEmbed});
            if (fin.length > 10) fin = fin.slice(0, 10);
            fin = fin.sort((a, b) => b[1].games.hangman.gamesPlayed - a[1].games.hangman.gamesPlayed);
            fin.forEach(a =>
            {
                let ment = allMembers.get(a[0]);
                lbString += `${counter++}. ${ment} - ${a[1].games.hangman.gamesPlayed}\n`;
            });
        } else if (args[1] == 'w/l')
        {
            title = `win/loss ratio`
            let fin = filtered.filter(a => a[1].games.hangman).filter(a => a[1].games.hangman.gamesPlayed > 0);
            errorEmbed.description = 'no players that have played a game were found in this server :(';
            if (fin.length < 1) return message.channel.send({embed:errorEmbed});
            if (fin.length > 10) fin = fin.slice(0, 10);
            fin.forEach(a =>
            {
                let aWon = a[1].games.hangman.gamesWon;
                let aPlayed = a[1].games.hangman.gamesPlayed;
                let aLost = aPlayed - aWon;
                if (aLost == 0) aLost = 1;
                let aRatio = aWon/aLost;
                a.rating = aRatio;
            })
            fin = fin.sort((a, b) => b.rating - a.rating);
            fin.forEach(a =>
            {
                let ment = allMembers.get(a[0]);
                lbString += `${counter++}. ${ment} - ${a[1].rating.toFixed(2)}\n`;
            });
        }
        let lbEmbed =
        {
            color: greenCol, title: `this server's leaderboard for ${title}`,
            description: lbString, footer: global.footer
        };
        return message.channel.send({embed:lbEmbed});
    }
}