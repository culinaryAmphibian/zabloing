const config = require('../../DB/config.json');
const Links = config.imageLinks.videos.sori;

module.exports =
{
    name: 'sori', description: 'sadcats',
    execute(message)
    {
        message.react('😢');
        message.channel.send({files:[{attachment:Links}]});
        return;
    }
}