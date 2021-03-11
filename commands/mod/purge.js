module.exports =
{
    name: 'purge', description: 'bulk-deleted a specified number of messages',
    execute(message, args, bot)
    {
        if ((message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) && (message.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")))
        {
            if (args[1])
            {
                let num = args[1];
                if ( (!isNaN(args[1])) && (!num.includes('-')) && (!num.includes('.')) && (!num == 0))
                {
                    message.channel.bulkDelete(num);
                    return;
                }
            }
        }
    }
}