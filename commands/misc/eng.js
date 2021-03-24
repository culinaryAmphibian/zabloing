const translate = require('@vitalets/google-translate-api');

function fromISO(str)
{
    // no cebuano
    // no fillipino
    // no hawaiian
    // no hmong

    let lang;
    switch(str)
    {
        case 'af':
            lang = 'afrikaans';
        case 'ak':
            lang = 'akan';
            break;
        case 'am':
            lang = 'amharic'
            break;
        case 'ar':
            lang = 'arabic';
            break;
        case 'az':
            lang = 'azerbaijani';
            break;
        case 'be':
            lang = 'belarussian';
            break;
        case 'bn':
            lang = 'bengali';
            break;
        case 'bs':
            lang = 'bosnian';
            break;
        case 'bg':
            lang = 'bulgarian';
            break;
        case 'ca':
            lang = 'catalan/valencian';
            break;
        case 'co':
            lang = 'corsican';
            break;
        case 'cs':
            lang = 'czech';
            break;
        case 'cy':
            lang = 'welsh';
            break;
        case 'da':
            lang = 'danish';
            break;
        case 'de':
            lang = 'german';
            break;
        case 'el':
            lang = 'greek';
            break;
        case 'en':
            lang = 'english';
            break;
        case 'eo':
            lang = 'esperanto';
            break;
        case 'es':
            lang = 'spanish';
            break;
        case 'et':
            lang = 'estonian';
            break;
        case 'eu':
            lang = 'basque';
            break;
        case 'fa':
            lang = 'persian';
            break;
        case 'fi':
            lang = 'finnish';
            break;
        case 'fr':
            lang = 'french';
            break;
        case 'fy':
            lang = 'frisian/western frisian';
            break;
        case 'ga':
            lang = 'irish';
            break;
        case 'gd':
            lang = 'gaelic/scottish gaelic';
            break;
        case 'gl':
            lang = 'galician';
            break;
        case 'gu':
            lang = 'gujarati';
            break;
        case 'ha':
            lang = 'hausa';
            break;
        case 'he':
            lang = 'hebrew';
            break;
        case 'hi':
            lang = 'hindu';
            break;
        case 'hr':
            lang = 'croation';
            break;
        case 'ht':
            lang = 'hatian creole';
            break;
        case 'hu':
            lang = 'hungarian'
        case 'hy':
            lang = 'armenian';
            break;
        case 'id':
            lang = 'indonesian';
            break;
        case 'ig':
            lang = 'igbo';
            break;
        case 'is':
            lang = 'icelandic';
            break;
        case 'it':
            lang = 'italian';
            break;
        case 'ja':
            lang = 'japanese';
            break;
        case 'jv':
            lang = 'javanese';
            break;
        case 'ka':
            lang = 'georgian';
            break;
        case 'kk':
            lang = 'kazakh';
            break;
        case 'km':
            lang = 'cambodian/khmer/central khmer';
            break;
        case 'kn':
            lang = 'kannada';
            break;
        case 'ko':
            lang = 'korean';
            break;
        case 'ku':
            lang = 'kurdish';
            break;
        case 'ky':
            lang = 'kirghiz/kyrgyz';
            break;
        case 'la':
            lang = 'latin';
            break;
        case 'lb':
            lang = 'luxembourgish/letzeburgesch';
            break;
        case 'lt':
            lang = 'lithuanian';
            break;
        case 'lv':
            lang = 'latvian';
            break;
        case 'lo':
            lang = 'lao';
            break;
        case 'mg':
            lang = 'malagasy';
            break;
        case 'mi':
            lang = 'maori';
            break;
        case 'mk':
            lang = 'macedonian';
            break;
        case 'ml':
            lang = 'malayalam';
            break;
        case 'mn':
            lang = 'mongolian';
            break;
        case 'mr':
            lang = 'marathi';
            break;
        case 'ms':
            lang = 'malay';
            break;
        case 'mt':
            lang = 'maltese';
            break;
        case 'my':
            lang = 'burmese';
            break;
        case 'ne':
            lang = 'nepali';
            break;
        case 'nl':
            lang = 'dutch/flemish';
            break;
        case 'no':
            lang = 'norwegian';
            break;
        case 'ny':
            lang = 'chichewa';
            break;
        case 'or':
            lang = 'oriya';
            break;
        case 'pa':
            lang = 'punjabi/panjabi';
            break;
        case 'pl':
            lang = 'polish';
            break;
        case 'ps':
            lang = 'pashto/pushto';
            break;
        case 'pt':
            lang = 'portugese';
            break;
        case 'ro':
            lang = 'romanian or moldavian/moldovan';
            break;
        case 'ru':
            lang = 'russian';
            break;
        case 'rw':
            lang = 'kinyarwanda';
            break;
        case 'sd':
            lang = 'sindhi';
            break;
        case 'si':
            lang = 'sinhala/sinhalese';
            break;
        case 'sk':
            lang = 'slovak';
            break;
        case 'sl':
            lang = 'slovenian';
            break;
        case 'sm':
            lang = 'samoan';
            break;
        case 'sn':
            lang = 'shona';
            break;
        case 'so':
            lang = 'somali';
            break;
        case 'sq':
            lang = 'albanian';
            break;
        case 'sr':
            lang = 'serbian';
            break;
        case 'st':
            lang = 'sesotho/southern sotho';
            break;
        case 'su':
            lang = 'sundanese';
            break;
        case 'sv':
            lang = 'swedish';
            break;
        case 'sw':
            lang = 'swahili';
            break;
        case 'ta':
            lang = 'tamil';
            break;
        case 'te':
            lang = 'telegu';
            break;
        case 'tg':
            lang = 'tajik';
            break;
        case 'th':
            lang = 'thai';
            break;
        case 'tk':
            lang = 'turkmen';
            break;
        case 'tr':
            lang = 'turkish';
            break;
        case 'tt':
            lang = 'tatar';
            break;
        case 'ug':
            lang = 'uighur/uyghur';
            break;
        case 'uk':
            lang = 'ukranian';
            break;
        case 'uz':
            lang = 'uzbek';
            break;
        case 'vi':
            lang = 'vietnamese';
            break;
        case 'xh':
            lang = 'xhosa';
            break;
        case 'yi':
            lang = 'yiddish';
            break;
        case 'yo':
            lang = 'yoruba';
            break;
        case 'zh':
            lang = 'chinese';
            break;
        case 'zu':
            lang = 'zulu';
            break;
        default:
            lang = 'woah, we didn\'t register that one';
            console.log(str);
    }
    return lang;
}

module.exports =
{
    name: 'eng', description: 'translates to english by default',
    execute(message, args, prefix)
    {
        if (!args[1]) return;
        let literal;
        return (translate(message.content.substr(args[0].length + prefix.length + 1), {to:'en'})
        .then(translated =>
        {
            switch(translated.raw[0][0])
            {
                case null:
                    literal = '';
                    break;
                default:
                    literal = `( ${translated.raw[0][0]} )`;
                    break;
            }
            message.channel.send(`translated from ${fromISO(translated.from.language.iso)} to english: "${translated.text}" ` + literal);
        }));
    }
}