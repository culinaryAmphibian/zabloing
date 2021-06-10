let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: ['ping'], description: 'returns the websocket and api ping',
    async execute(message, args, bot)
    {
        const pinging = await(message.channel.send('Pinging...'));
        const embed = { color: blueCol, title: 'ping thing',
        fields: 
        [ 
            { name: 'time between my message and your message', value: `${pinging.createdTimestamp - message.createdTimestamp} ms`},
            { name: 'websocket/api ping', value: `${(bot.ws.ping)} ms`}
        ],
        footer: global.footer};
        return pinging.edit(`Pong!`, {embed:embed});
    }
}