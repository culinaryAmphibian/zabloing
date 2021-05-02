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
                { name: `${prefix}av`, value: `fetches a user's profile picture - can work with user id, nickname, and username`},
                { name: `${prefix}say`, value: `says a specified string` },
                { name: `${prefix}ignoreme`, value: `ignores your messages unless it's "${prefix}unignore"`},
                { name: `${prefix}unignore`, value: `stops ignoring you if you were ignored in the first place`},
                { name: `${prefix}ping`, value: `returns the websocket and api ping` },
                { name: `${prefix}addemoji`, value: `creates an emoji with the given message content\nusage:\n${prefix}addemoji <emoji name, single word if using a link for the image, multiple word if you're using an attachment> <link or attachment (link has to start with "https://")>`},
                { name: `${prefix}firstmsg`, value: `fetches the first message in the channel`},
                { name: `${prefix}serverinfo`, value: `displays info about the server`},
                { name: `${prefix}ui`, value: `displays info about a user\nusage: ${prefix}ui <user mention, id, nickname, username, or tag>`},
                { name: `${prefix}emoji`, value: `displays info about an emoji (doesn't work with default emoji)`},
                { name: `${prefix}translate`, value: `translates a query\nusage: ${prefix}translate <optional:code or name of the language to translate to, english by default> <query, can be mutliple words> <optional: name or code of the language to force translate **from**, surrounded in double backticks>`},
                { name: `${prefix}image`, value: `fetches an image from google images based on the query (it's a bit slow)\nusage: ${prefix}image <query, can be multiple words>`},
                { name: `${prefix}idk`, value: `initiates a game of hangman`},
                { name: `${prefix}color or ${prefix}colour`, value: `assigns or creates a color role\nusage: ${prefix}color/colour <color hex code or basic color name (there are only 8 defaults)>`},
                { name: `${prefix}help calc`, value: `did you know that this bad boy has a calculator :smirk:`}
            ], footer: {text: global.eft, icon_url: global.efi }
        };
        return message.channel.send({embed:miscHelpEmbed});
    }
}