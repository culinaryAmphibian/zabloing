module.exports =
{
    name: ['count'], description: 'counts to a specified number', usage: '[pref]count <number>', hide: true,
    execute(message, args)
    {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send('you don\'t have the perms!');
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send('i won\'t allow myself to do it unless i can purge the messages.');
        if (!args[1]) return message.channel.send('please specify a number to count to')
        if (isNaN(args[1]) || args[1].includes('-') || args[1].includes('.') || args[1] == 0) return message.channel.send('invalid number specified');
        let num = parseInt(args[1]);
        for (let i = 1; i <= num; i++)
        {
            message.channel.send(i);
        }
        return;
    }
}