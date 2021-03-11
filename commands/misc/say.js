module.exports =
{
    name: 'say', description: 'says a thing',
    execute(message, prefix)
    {
        if ( (!message.mentions.members.first()) && (!message.mentions.everyone))
        {
            message.channel.send(message.content.substring(prefix.length + 4));
            message.delete();
            return;
        }
        else return;
    }
}