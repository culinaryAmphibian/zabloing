let r = (Math.floor(Math.random() * 50)) + 1;
let g = (Math.floor(Math.random() * 54)) + 201;
let b = (Math.floor(Math.random() * 40)) + 40;
greenCol = [r,g,b];

let e = `user mention, username/nickname, or user id`

module.exports =
{
    name: 'econHelp',
    execute(message, prefix, args)
    {
        // if (args[1]) return;
        let embed =
        {
            color: greenCol, title: `a list of commands to play the economy game`,
            fields:
            [
                { name: `${prefix}bal`, value: `checks a user\'s amount of ${global.currency}\nusage: ${prefix}bal <${e}>` },
                { name: `${prefix}lb`, value: `display's the server's leaderboard\n avalilable options: "w/l", "${global.currency}", and "played"; defaults to ${global.currency}\nusage: ${prefix}lb <option>`},
                { name: `${prefix}pay`, value: `a command for you to pay a user a certain amount of ${global.currency}\nusage: ${prefix}pay <amount of ${global.currency}> <${e}>` },
                { name: `${prefix}daily`, value: `claims your daily reward of ${global.currency}`},
                { name: `wait, so how do i get the points?`, value: `collect daily rewards and win the hangman game when you play it (${prefix}idk)`}
            ], footer: { text: global.eft, icon_url: global.efi }
        };
        return message.channel.send({embed:embed});
    }
}