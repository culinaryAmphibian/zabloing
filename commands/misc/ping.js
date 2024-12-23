module.exports =
{
    name: ['ping'], description: 'returns the websocket and api ping',
    async execute(message, args, bot)
    {
        const pinging = await(message.channel.send('Pinging...'));
        const embed = { color: global.blue, title: 'ping thing',
        fields: 
        [ 
            { name: 'time between my message and your message', value: `${pinging.createdTimestamp - message.createdTimestamp} ms`},
            { name: 'websocket/api ping', value: `${(bot.ws.ping)} ms`}
        ],
        footer: global.footer};
        return pinging.edit(`Pong!`, {embed:embed});
    }
}