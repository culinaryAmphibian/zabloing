const fs = require('fs');
const UserJSON = require('../../DB/users.json');

module.exports =
{
    name: 'newUser', description: 'what to write to the database when new user', hide: true,
    execute(user, guildId)
    {
        if (UserJSON[user.id]) return;
        UserJSON[user.id] =
        {
            name: [{name: user.tag, timeStamp: new Date().getTime()}],
            servers: [
                {
                    guildId: guildId, 
                    time: new Date().getTime(), 
                    log:
                    [
                        {
                            type: '_join',
                            time: new Date().getTime()
                        }
                    ],
                    currentlyInThere: true
                }
            ],
            ignore: false, msgs: 0,
            cooldowns: { hangman: 0, googleImages: 0 },
            games:
            {
                bal: 0,
                lastClaimedDaily: new Date().getTime() - (1000 * 60 * 60 * 24),
                hangman:
                {
                    playing: false,
                    startedANewGame: false,
                    lastGameLink: 0,
                    gamesPlayed: 0,
                    gamesWon: 0
                }
            }
        }
        return fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
    }
}