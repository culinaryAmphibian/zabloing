module.exports =
{
    name: 'count', description: 'counts to a specified number',
    execute(message, args, bot)
    {
        if ((message.member.hasPermission("MANAGE_MESSAGES")) && (message.guild.me.hasPermission("MANAGE_MESSAGES")))
        {
            if (args[1])
            {
                let num = args[1];
                if ( (!isNaN(args[1])) && (!num.includes('-')) && (!num.includes('.')) && (!num == 0))
                {
                    let i;
                    for (i = 1; i <= num; i++)
                    {
                        message.channel.send(i);
                    }
                    return;
                }
            }
        }
    }
}