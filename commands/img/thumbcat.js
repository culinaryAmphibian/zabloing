const config = require('../../DB/config.json');
const Link = config.imageLinks.videos.thumbsupcat;

module.exports =
{
    name: ['thumbcat'], description: 'e',
    execute(message)
    {
        message.react('👍');
        message.channel.send({files:[{attachment:Link}]});
    }
}