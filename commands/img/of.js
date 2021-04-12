const config = require('../../DB/config.json');
const Links = config["imageLinks"];
module.exports =
{
    name: 'of', description: ':flushed:',
    execute(message)
    {
        message.react('😳');
        message.channel.send('onlyfans sent!');
        message.channel.send({files:[{attachment:Links.of}]})
        .catch(() => { message.channel.send("I can't dm you :("); })
        return;
    }
}