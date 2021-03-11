const fs = require('fs');

module.exports =
{
    name: 'ignore', description: 'ignores a user',
    execute(message, args, UserJSON)
    {
        UserJSON[message.author.id].ignore = true;
        fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON), null, 2);
        message.channel.send('you will now be ignored!')
        return;
    }
}