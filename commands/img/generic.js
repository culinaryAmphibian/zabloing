const ConfigJSON = require('../../DB/config.json');
const ServerJSON = require('../../DB/servers.json');

module.exports =
{
    name: 'arbImg', hide: true,
    execute(message, a)
    {
        if (ServerJSON[message.guild.id]?.disabled?.includes?.(a)) return;
        if (ConfigJSON.imageLinks.images[a]) return message.channel.send(ConfigJSON.imageLinks.images[a]);
        else return message.channel.send({files:[ConfigJSON.imageLinks.videos[a]]});
    }
}