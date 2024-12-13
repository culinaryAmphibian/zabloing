const { currency } = require('../../DB/config.json');
const UserJSON = require('../../DB/users.json');

module.exports = {
    name: ['lb', 'leaderboard'], description: 'displays the server\'s leaderboard',
    usage: '[pref]lb ?<w/l, played>\nexample: [pref]lb played', note: `the optional parameter defaults to sorting by ${currency}`,
    async execute(message, args) {
        const errorEmbed = {color: global.orange, title: 'error', description: '', footer: global.footer}
        let lbString = '';
        let counter = 1;
        let title;
        let allMembers = await(message.guild.members.fetch(true));
        let h = Object.entries(UserJSON);
        let filtered = h.filter(a => a[1].servers.find(b => b.guildId == message.guild.id && b.currentlyInThere));
        if (!args[1] || args[1] == currency) {
            title = `total ${currency}`;
            let fin = filtered.filter(a => a[1].games.bal > 0);
            errorEmbed.description = 'no players with a balance higher than 0 were found in this server :(';
            if (fin.length < 1)
                return message.channel.send({embeds:[errorEmbed]});
            fin = fin.sort((a, b) => b[1].games.bal - a[1].games.bal);
            if (fin.length > 10)
                fin = fin.slice(0, 10);
            fin.forEach(m => lbString += `${counter++}. <@${m[0]}> - ${m[1].games.bal}\n`);
        } else if (args[1] == 'played') {
            title = `total games played`;
            let fin = filtered.filter(a => a[1].games.hangman).filter(a => a[1].games.hangman.gamesPlayed > 0);
            errorEmbed.description = 'no players that have played a game were found in this server :(';
            if (fin.length < 1)
                return message.channel.send({embeds:[errorEmbed]});
            fin = fin.sort((a, b) => b[1].games.hangman.gamesPlayed - a[1].games.hangman.gamesPlayed);
            if (fin.length > 10)
                fin = fin.slice(0, 10);
            fin.forEach(a => lbString += `${counter++}. <@${m[0]}> - ${a[1].games.hangman.gamesPlayed}\n`);
        } else if (args[1] == 'w/l') {
            title = `win/loss ratio`
            let fin = filtered.filter(a => a[1].games.hangman).filter(a => a[1].games.hangman.gamesPlayed > 0);
            errorEmbed.description = 'no players that have played a game were found in this server :(';
            if (fin.length < 1)
                return message.channel.send({embeds:[errorEmbed]});
            fin.forEach(a => {
                let aWon = a[1].games.hangman.gamesWon;
                let aPlayed = a[1].games.hangman.gamesPlayed;
                let aLost = aPlayed - aWon;
                if (aLost == 0) aLost = 1;
                a.rating = aWon/aLost;
            })
            fin = fin.sort((a, b) => b.rating - a.rating);
            if (fin.length > 10)
                fin = fin.slice(0, 10);
            fin.forEach(a => lbString += `${counter++}. <@${a[0]}> - ${a[1].rating.toFixed(2)}\n`);
        }
        return message.channel.send({embeds:[{
            color: global.green,
            title: `this server's leaderboard for ${title}`,
            description: lbString, footer: global.footer
        }]});
    }
}