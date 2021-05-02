const config = require('../../DB/config.json');
const Links = config.imageLinks.images.of;
module.exports =
{
    name: 'of', description: ':flushed:',
    execute(message)
    {
        message.react('😳');
        message.channel.send('onlyfans sent!');
        message.author.send({files:[{attachment:Links}]})
        .catch(() => { message.channel.send("I can't dm you :("); })
        return;
    }
}