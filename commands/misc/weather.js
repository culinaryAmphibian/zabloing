const weather = require('weather-js');

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

let errEmbed = {color: orangeCol, title: 'error', description: 'please specify a location', footer: global.footer};

function CAndF(tempInC)
{
    let F = Math.round(tempInC * 1.8 + 32);
    return `${tempInC}℃, ${F}℉`;
}

function kmAndMph(windSpeedText)
{
    let parsed = windSpeedText.split(' ');
    let km = parsed[0];
    let mi = Math.round(km/1.609344);
    return `${km} km/h, ${mi} mph ${parsed.pop().toLowerCase()}`;
}

module.exports =
{
    name: ['weather'], description: 'gets the weather for a particular area (only use in dms, without prefix!)', dmOnly: true, usage: 'weather <city, zip code, etc.>\nexample: weather los angeles',
    note: 'this command only works in dms for privacy reasons, so don\'t use a prefix for this command\nfrom my experience, it doesn\'t show a forecast for a zip codes, so you might want to search for a more general area.',
    async execute(message)
    {
        if (message.guild) return;
        let args = message.content.toLowerCase().split(" ");
        let location = args.slice(1);
        if (!location) return message.author.send({embed:errEmbed});
        weather.find({search: location, degreeType: 'C'}, function(err, result)
        {
            errEmbed.description = `an error ocurred: ${err}, probably because you didn't specify a valid location.`;
            if (err) return message.author.send({embed:errEmbed});
            let current = result[0].current;
            let forecast = [];
            if (result[1]) forecast = result[1].forecast;
            let embed =
            {
                color: blueCol, thumbnail: { url: current.imageUrl },
                title: `weather for ${current.observationpoint.toLowerCase()}`,
                description: `last measured at ${current.observationtime} ${current.date}`,
                fields:
                [
                    { name: 'current weather conditions:', value: '_______________' },
                    { name: 'temperature', value: CAndF(current.temperature), inline: true },
                    { name: 'feels like', value: CAndF(current.feelslike), inline: true },
                    { name: 'sky', value: current.skytext.toLowerCase(), inline: true },
                    { name: 'wind', value: kmAndMph(current.winddisplay), inline: true },
                    { name: 'humidity', value: `${current.humidity}%`, inline: true }
                ]
            };
            if (forecast.length > 0)
            {
                embed.fields.push({ name: '5-day forecast', value: `_______________`});
                forecast.forEach(day =>
                {
                    let objToPush = {name: `${day.shortday.toLowerCase()} ${day.date}`, value: `high: ${CAndF(day.high)}, low: ${CAndF(day.low)}\nsky: ${day.skytextday.toLowerCase()}`, inline: true};
                    if (day.precip.length > 0) objToPush.value += `\nprecipitation: ${day.precip}`;
                    embed.fields.push(objToPush);
                });
            }
            message.author.send({embed:embed});
        });
    }
}