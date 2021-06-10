const fs = require('fs');
const UserJSON = require('../../DB/users.json');

module.exports =
{
    name: 'userdb', description: `enters the user into the database automatically and other stuffs`, hide: true,
    async execute(message, bot)
    {
        let id = UserJSON[message.author.id];
        if (!id) await bot.commandsForInternalProcesses.get('newUser').execute(message.author, message.guild.id);
        if (id?.name?.slice?.(-1)?.[0]?.name !== message.author.tag) id?.name?.push?.({name: message.author.tag, timeStamp: new Date().getTime()});
        if (!id.cooldowns) id.cooldowns = {};
        if (!id.games) id.games = {bal: 0};
        if (!id.msgs) id.msgs = 0;
        id.msgs++;
        return fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
    }
}