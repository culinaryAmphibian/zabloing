const config = require('../../shhh/config');
module.exports =
{
    name: 'of', description: ':flushed:',
    execute(message)
    {
        message.react('😳');
        message.channel.send('onlyfans sent!');
        message.author.send(config.imageLinks.of)
        .catch((err) => { message.channel.send("I can't dm you :("); });
        return;
    }
}