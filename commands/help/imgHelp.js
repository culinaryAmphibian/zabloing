let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'imgHelp', description: 'list of image commands',
    execute(message, prefix)
    {
        let imgHelpEmbed =
        {
            color: blueCol, title: 'a list of image commands',
            fields: [
                {name: 'Commands that do not require a prefix', value: `thankus, lisa, birth, why, sori, me lon, femboy, mad cat drip, 👍`},
                {name: `Commands that *do* require a prefix`, value: `_____________`},
                { name: `just images`, value: `zabloing, googas, gronch, lao, lfao, spong, ganca, single, sessogatto`},
                { name: `animated images`, value: `snowducc, zingus, woo`, inline: true},
                { name: 'special image commands', value: `onlyfans, shishcat, chiro, kai, istella, floppa`, inline: true}
            ], footer: { text: global.eft, icon_url: global.efi }
        };
        return message.channel.send({embed:imgHelpEmbed});
    }
}