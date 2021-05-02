let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'modHelp', description: 'a lit of commands used for moderation',
    execute(message, prefix, args)
    {
        let modHelpEmbed =
        {
            color: blueCol, title: 'a list of misceallaneous commands',
            fields: [
                { name: `${prefix}kick`, value: `kicks a user`},
                { name: `${prefix}ban`, value: `bans a user` },
                { name: `${prefix}purge`, value: `bulk-deletes messages`}
                
            ], footer: {text: global.eft, icon_url: global.efi }
        };
        return message.channel.send({embed:modHelpEmbed});
    }
}