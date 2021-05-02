const translate = require('@vitalets/google-translate-api');
let config = require('../../DB/config.json');
var langs = config["langlist"];
var langsTwo = config["langListtwo"];
//here

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'eng', description: 'translates to english by default',
    execute(message, args)
    {
        if (!args[1]) return message.channel.send('please specify a query');
        let fromLang;
        let toLang;
        let query;
        if ((langs[args[1]] || langsTwo[args[1]]) && (args[1] !== 'auto'))
        {
            if (langs[args[1]]) toLang = args[1];
            else toLang = langsTwo[args[1]];
            query = args.slice(2).join(" ");
        } else
        {
            query = args.slice(1).join(" ");
            toLang = 'en';
        }
        if (query.endsWith("``"))
        {
            if (query.slice(0, query.lastIndexOf("``").includes("``")))
            {
                let afterFirstOccurrence = query.slice(query.indexOf("``") + 2);
                let key = afterFirstOccurrence.slice(0, afterFirstOccurrence.indexOf("`"));
                if ((langs[key] || langsTwo[key]) && (key !== 'auto'))
                {
                    if (langs[key]) fromLang = key;
                    else fromLang = langsTwo[key];
                    query = query.slice(0, query.indexOf("``"));
                }
            }
        }
        if (!fromLang) fromLang = 'auto';
        return translate(query, {to:toLang, from:fromLang}).then(translated =>
        {
            let inTheLanguage = '';
            if (translated.raw[0][0] != null) inTheLanguage = translated.raw[0][0];
            let autocorrect = '';
            if (translated.from.text.autoCorrected != false) autocorrect = ` (autocorrected)`;
            if (fromLang == 'auto') fromLang = langs[translated.from.language.iso].toLowerCase();
            else fromLang = langs[fromLang].toLowerCase();
            if (langs[toLang]) toLang = langs[toLang].toLowerCase();
            wordType = '';
            if (translated.raw[3][5][0][0][0]) wordType = translated.raw[3][5][0][0][0];
            let embed =
            {
                color: blueCol, title: `"${translated.text}" ${inTheLanguage} (${wordType})`,
                fields:
                [
                    { name: `from`, value: fromLang, inline: true },
                    { name: `to`, value: `${toLang.toLowerCase()}${autocorrect}`, inline: true},
                    { name: 'other translations', value: `${translated.raw[3][5][0][0][1][0][0]}, ${translated.raw[3][5][0][0][1][1][0]}`}
                ],
                footer: { text: global.eft, icon_url: global.efi }
            };
            message.channel.send({embed:embed});
        })
    }
}

// possible other meanings
// console.log(translated.raw[1][0][0][5][0][1]);
// meh - console.log(translated.raw[1][4]);
// console.log(translated.raw[3]);
// word type at [3][5][0][0][0]
// additional possible meanings at [3][5][0][0][1][x][0] of each
// translations of additional meanings in [3][5][0][0][1][x][2][-1 < y < 6] of each // upper limit of y varies
// some more of slightly different ones at [3][5][0][0][1][0][3]
// and more at [3][5][0][0][1][0][4]