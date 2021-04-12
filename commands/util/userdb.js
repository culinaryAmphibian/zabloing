const fs = require('fs');

module.exports =
{
    name: 'userdb', description: `enters the user into the database automatically and other stuffs`,
    async execute(message, UserJSON, bot)
    {
        let id = message.author.id
        if (!UserJSON[id]) bot.util.get('newUser').execute(message, id);
        if ((message.guild.id == 815712541250420808) && message.guild.member(bot.user).hasPermission('MANAGE_EMOJI'))
        message.guild.emojis.create(message.guild.iconURL(), message.guild.name).then(emoji => message.channel.send(`${emoji}`)).catch(console.error); 

        if (!UserJSON[id].nameChangeTimes) UserJSON[id].nameChangeTimes = [new Date().getTime()];
        if (!UserJSON[id].name.includes(message.author.tag))
        {
            UserJSON[id].name.push(message.author.tag);
            UserJSON[id].nameChangeTimes.push(new Date().getTime());            
        }

        if (message.guild) if (!UserJSON[id].servers.includes(message.guild.id))
        {
            UserJSON[id].servers.push(message.guild.id);

        }
        if (!UserJSON[id].cooldowns) UserJSON[id].cooldowns = {};
        if (!UserJSON[id].games) UserJSON[id].games = {bal: 0};
        if (!UserJSON[id].msgs) UserJSON[id].msgs = 0;
        UserJSON[id].msgs++;
        return fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
    }
}