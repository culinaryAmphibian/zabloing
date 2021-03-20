let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'miscHelp', description: `list of misceallaneous commands`,
    execute(message, prefix, args)
    {
        let miscHelpEmbed =
        {
            color: blueCol, title: 'a list of misceallaneous commands',
            fields: [
                { name: `${prefix}av`, value: `fetches a user's profile picture - can work with user id (sometimes)`},
                { name: `${prefix}say`, value: `says a specified string` },
                { name: `${prefix}ignoreme`, value: `ignores your messages unless it's "${prefix}unignore"`},
                { name: `${prefix}unignore`, value: `stops ignoring you if you were ignored in the first place`},
                { name: `${prefix}help calc`, value: `did you know that this bad boy had a calculator :smirk:`}
            ], footer: {text: global.eft, icon_url: global.efi }
        };
        return message.channel.send({embed:miscHelpEmbed});
    }
}