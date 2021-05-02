module.exports =
{
    name: 'purge', description: 'bulk-deleted a specified number of messages',
    execute(message, args, bot)
    {
        if ((message.member.hasPermission("MANAGE_MESSAGES")) && (message.guild.me.hasPermission("MANAGE_MESSAGES")))
        {
            if (args[1])
            {
                let num = args[1];
                if ( (!isNaN(args[1])) && (!num.includes('-')) && (!num.includes('.')) && (!num == 0))
                {
                    message.channel.bulkDelete(parseInt(num));
                    return;
                }
            }
        }
    }
}