const fetch = require('node-fetch');

module.exports =
{
    name: 'captcha', description: 'fetches a captcha',
    async execute(message)
    {
        const url = 'https://api.no-api-key.com/api/v2/captcha';
        try 
        {
            fetch(url).then(res => res.json()).then(async (json) =>
                message.channel.send(json.captcha));
        } catch (error) {
            return message.channel.send(`an error has occurred: ${error}`);
        }
    }
}