module.exports =
{
    name: 'hackban', description: 'bans a user without them necessarily being in the server',
    async execute(message, args, bot)
    {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send('you don\'t have perms.');
        if (!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) return message.channel.send('i don\'t have perms.');
        let userId = args[1];
        let reason = args.slice(2).join(" ");
        if ( (!userId) || (isNaN(userId)) || (!userId.length != 18)) return message.channel.send('invalid user id');
        if (userId == message.author.id) return message.channel.send('don\'t ban yourself!');
        if (userId == bot.user.id) return message.channel.send('rude');
        if (!reason) reason = 'no reason provided';

        client.users.fetch(userId).then(async (user) =>
        {
            await message.guild.members.ban(user.id, {reason:reason});
            return message.channel.send(`${user.tag} has been banned from outside of this server <:lfao:792416785562861568>`);
        }).catch(err => {return message.channel.send(`oops, an error has occurred: ${err}`)});
    }
}