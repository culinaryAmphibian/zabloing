const dateFormat = import('dateformat');

module.exports =
{
    name: ['firstmsg'], description: 'fetches the first message of the channel', note: 'keep in mind that it fetches the first message of the channel, not of the server.',
    async execute(message)
    {
        const fetchMessages = await(message.channel.messages.fetch({after:1, limit:1}));
        const msg = fetchMessages.first();
        let messageCont = msg.content;
        messageCont ? messageCont = `"${msg.content}"` : messageCont = `"${msg.content}" (this message has no content: it is either a welcome message or has an attachment)`;
        let embed =
        {
            color: global.blue, title: `the first message in this channel`, url:msg.url, thumbnail:{url:msg.author.displayAvatarURL({dynamic:true, size:4096})},
            description: `the first in ${message.channel}`, fields:
            [
                {name: 'content', value: messageCont}, {name: 'author', value: `${msg.author} (${message.author.id})`}, {name: 'date', value: `${dateFormat(msg.createdTimestamp, 'default', true)} UTC`}
            ], footer: global.footer
        };
        return message.channel.send({embeds:[embed]});
    }
}