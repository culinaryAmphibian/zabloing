const dateFormat = require('dateformat');

module.exports =
{
    name: ['firstmsg'], description: 'fetches the first message of the channel', note: 'keep in mind that it fetches the first message of the channel, not of the server.',
    async execute(message)
    {
        const fetchMessages = await(message.channel.messages.fetch({after:1, limit:1}));
        const msg = fetchMessages.first();
        let embed =
        {
            color: global.blueCol, title: `the first message in this channel`, url:msg.url, thumbnail:{url:msg.author.displayAvatarURL({dynamic:true, size:4096})},
            description: `the first in ${message.channel}`, fields:
            [
                {name: 'content', value: `"${msg.content}"`}, {name: 'author', value: `${msg.author} (${message.author.id})`}, {name: 'date', value: `${dateFormat(msg.createdTimestamp, 'default', true)} UTC`}
            ], footer: global.footer
        };
        return message.channel.send({embed:embed});
    }
}