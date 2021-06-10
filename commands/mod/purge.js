let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

let errEmbed = {color: orangeCol, title: 'error', description: 'you don\'t have the perms!', footer: global.footer};

module.exports =
{
    name: ['purge'], description: 'bulk-deletes a specified number of messages', usage: '[pref]purge <number>\nexample: [pref]purge 15',
    execute(message, args)
    {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({embed:errEmbed});
        errEmbed.description = 'i don\'t have the perms';
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send({embed:errEmbed});
        errEmbed.description = 'please specify an amount of messages to purge';
        if (!args[1]) return message.channel.send({embed:errEmbed});
        let num = args[1];
        errEmbed.description = 'please specify a positive integer of messages to delete.';
        if (isNaN(args[1]) || num.includes('-') || num.includes('.') || num == 0 ) return message.channel.send({embed:errEmbed});
        return message.channel.bulkDelete(parseInt(num));
    }
}