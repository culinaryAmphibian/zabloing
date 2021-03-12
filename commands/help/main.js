let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'help', description: 'lists of available commands',
    execute(message, args, prefix)
    {
        if (args[1])
        {
            switch(args[1])
            {
                case 'img':
                    let imgHelpEmbed =
                    {
                        color: blueCol, title: 'a list of image commands',
                        fields:
                        [
                            {name: 'Commands that do not require a prefix', value: `thankus, lisa, birth, why, sori, me lon, femboy, mad cat drip, 👍`},
                            {name: `Commands that *do* require a prefix`, value: `_____________`},
                            { name: `just images`, value: `zabloing, googas, gronch, lao, lfao, spong, ganca, single, sessogatto`},
                            { name: `animated images`, value: `snowducc, zingus, woo`, inline: true},
                            { name: 'special image commands', value: `onlyfans, shishcat, chiro, kai, istella, floppa`, inline: true}
                        ], footer: { text: global.eft, icon_url: global.efi }
                    };
                    message.channel.send({embed:imgHelpEmbed});
                    break;
                case 'misc':
                    let miscHelpEmbed =
                    {
                        color: blueCol, title: 'a list of misceallaneous commands',
                        fields:
                        [
                            { name: `${prefix}av`, value: `fetches a user's profile picture - can work with user id (sometimes)`},
                            { name: `${prefix}say`, value: `says a specified string` },
                            { name: `${prefix}ignoreme`, value: `ignores your messages unless it's "${prefix}unignore"`},
                            { name: `${prefix}unignore`, value: `stops ignoring you if you were ignored in the first place`}
                        ], footer: {text: global.eft, icon_url: global.efi }
                    };
                    message.channel.send({embed:miscHelpEmbed});
                    break;
                case 'econ':
                    break;
                case 'mod':
                    let modHelpEmbed =
                    {
                        color:blueCol, title: ' a list of commands for moderation',
                        fields:
                        [
                            { name: `${prefix}purge`, value: `bulk-deletes messages`},
                            { name: `more?`, value: `more will definitely be added soon™`}
                        ], footer: {text: global.eft, icon_url: global.efi }
                    };
                    message.channel.send({embed:modHelpEmbed});
                    break;
            }
            return;
        } else
        {
            let helpEmbd =
            {
                color: blueCol, title: `hey there!`, description: 'here is a list of all my command categories.',
                fields:
                [
                    { name: `${prefix}help img`, value: `a list of all commands that return an image` },
                    { name: `${prefix}help misc`, value: `a list of misceallaneous commands` },
                    { name: `${prefix}help econ`, value: `a list of the economy game commands` },
                    { name: `${prefix}help mod`, value: `a list of commands to be used for moderation`}
                ],
                footer: { text: global.eft, icon_url: global.efi }
            };
            message.channel.send({embed:helpEmbd});
            return;
        }
    }
}