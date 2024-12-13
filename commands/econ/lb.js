const ConfigJSON = require('../../DB/config.json');
const UserJSON = require('../../DB/users.json');

let errorEmbed = {color: global.orange, title: 'error', description: '', footer: global.footer};

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
        // var filtered = h.filter(a => a[1].servers.map(s => s.guildId || s).includes(message.guild.id))
        //     .filter(a => a[1].games);
        filtered = h.filter(a => (typeof a[1].servers[0] == 'string' && a[1].servers.includes(message.guild.id)) || (typeof a[1].servers[0] == 'object' && a[1].servers.find(b => b.guildId == message.guild.id && b.currentlyInThere)));
        if ( (!args[1]) || (args[1] == `${ConfigJSON.currency}`) )
        {
            title = `total ${ConfigJSON.currency}`;
            let fin = filtered.filter(a => a[1].games.bal > 0);
            errorEmbed.description = 'no players with a balance higher than 0 were found in this server :(';
            if (fin.length < 1) return message.channel.send({embeds:[errorEmbed]});
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
            if (fin.length < 1) return message.channel.send({embeds:[errorEmbed]});
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
            if (fin.length < 1) return message.channel.send({embeds:[errorEmbed]});
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
            color: global.green, title: `this server's leaderboard for ${title}`,
            description: lbString, footer: global.footer
        };
        return message.channel.send({embeds:[lbEmbed]});
    }
}