const translate = require('@vitalets/google-translate-api');

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

var langs = { 'auto': 'Automatic', 'af': 'Afrikaans','sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic', 'hy': 'Armenian','az': 'Azerbaijani','eu': 'Basque','be': 'Belarusian','bn': 'Bengali','bs': 'Bosnian','bg': 'Bulgarian','ca': 'Catalan','ceb': 'Cebuano','ny': 'Chichewa','zh-CN': 'Chinese (Simplified)','zh-TW': 'Chinese (Traditional)','co': 'Corsican','hr': 'Croatian','cs': 'Czech','da': 'Danish','nl': 'Dutch','en': 'English','eo': 'Esperanto','et': 'Estonian','tl': 'Filipino','fi': 'Finnish','fr': 'French','fy': 'Frisian','gl': 'Galician','ka': 'Georgian','de': 'German','el': 'Greek','gu': 'Gujarati','ht': 'Haitian Creole','ha': 'Hausa','haw': 'Hawaiian','he': 'Hebrew','iw': 'Hebrew','hi': 'Hindi','hmn': 'Hmong','hu': 'Hungarian','is': 'Icelandic','ig': 'Igbo','id': 'Indonesian','ga': 'Irish','it': 'Italian','ja': 'Japanese','jw': 'Javanese','kn': 'Kannada','kk': 'Kazakh','km': 'Khmer','ko': 'Korean','ku': 'Kurdish (Kurmanji)','ky': 'Kyrgyz','lo': 'Lao','la': 'Latin','lv': 'Latvian','lt': 'Lithuanian','lb': 'Luxembourgish','mk': 'Macedonian','mg': 'Malagasy','ms': 'Malay','ml': 'Malayalam','mt': 'Maltese','mi': 'Maori','mr': 'Marathi','mn': 'Mongolian','my': 'Myanmar (Burmese)','ne': 'Nepali','no': 'Norwegian','ps': 'Pashto','fa': 'Persian','pl': 'Polish','pt': 'Portuguese','pa': 'Punjabi','ro': 'Romanian','ru': 'Russian','sm': 'Samoan','gd': 'Scots Gaelic','sr': 'Serbian','st': 'Sesotho','sn': 'Shona','sd': 'Sindhi','si': 'Sinhala','sk': 'Slovak','sl': 'Slovenian','so': 'Somali','es': 'Spanish','su': 'Sundanese','sw': 'Swahili','sv': 'Swedish','tg': 'Tajik','ta': 'Tamil','te': 'Telugu','th': 'Thai','tr': 'Turkish','uk': 'Ukrainian','ur': 'Urdu','uz': 'Uzbek','vi': 'Vietnamese','cy': 'Welsh','xh': 'Xhosa','yi': 'Yiddish','yo': 'Yoruba','zu': 'Zulu'};

module.exports =
{
    name: 'eng', description: 'translates to english by default',
    execute(message, args, prefix)
    {
        if (!args[1]) return;
        let literal;
        let autoCorrected;
        return (translate(message.content.substr(args[0].length + prefix.length + 1), {to:'en'})
        .then(translated =>
        {
            switch(translated.raw[0][0])
            {
                case null:
                    literal = '';
                    break;
                default:
                    literal = `(${translated.raw[0][0]} )`;
            }
            switch(translated.from.text.autoCorrected.toString())
            {
                case 'false':
                    autoCorrected = '';
                    break;
                case 'true':
                    autoCorrected = ' (autocorrected) ';
            }
            let embed =
            {
                color: blueCol, title: `"${translated.text}" ${literal}`, fields:
                [ { name: 'from', value: `${langs[translated.from.language.iso].toLowerCase()} ${autoCorrected}`, inline: true}, { name: `to`, value: 'english', inline: true} ],
                footer: { text: global.eft, icon_url: global.efi }
            };
            return message.channel.send({embed:embed});
        }));
    }
}