let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'ping', description: 'edit ping and websocket ping',
    async execute(message, bot)
    {
        const pinging = await(message.channel.send('Pinging...'));
        const embed = { color: blueCol, title: 'ping thing',
        fields: 
        [ 
            { name: 'time between my message and your message', value: `${pinging.createdTimestamp - message.createdTimestamp} ms`},
            { name: 'websocket/api ping', value: `${(bot.ws.ping)} ms`}
        ],
        footer: {text: global.eft, icon_url: global.efi}};
        return pinging.edit(`Pong!`, {embed:embed});
    }
}