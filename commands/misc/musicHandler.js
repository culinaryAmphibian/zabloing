module.exports =
{
    name: 'musicHandler', description: 'mhm yeah',
    execute(message, args, bot)
    {
        let vc = message.member.voice.channel;
        if (!vc) return message.channel.send('join a voice channel first!');
        switch(args[0])
        {
            case 'play':
                bot.musicCommands.get('play').execute(message, args, bot);
                break;
            case 'loop':
                bot.musicCommands.get('loop').execute(message, bot);
                break;
            case 'stop':
                bot.musicCommands.get('stop').execute(message, bot);
                break;
            case 'skip':
                bot.musicCommands.get('skip').execute(message, bot);
                break;
            case 'queue':
                bot.musicCommands.get('queue').execute(message, bot);
                break;
            // add filter stuff
        }
        //listeners
        bot.distube
            .on('playSong', async(message, queue, song) =>
            {
                bot.musicCommands.get('playSong').execute(message, queue, song);
            })
            .on('addSong', async(message, queue, song) =>
            {
                bot.musicCommands.get('addSong').execute(message, queue, song);
            })
            .on("playList", async(message, queue, playlist, song) => 
            {
                bot.musicCommands.get('playlist').execute(message, queue, playlist, song);
            })
            .on("addList", async(message, queue, playlist) =>
            {
                bot.musicCommands.get('addList').execute(message, queue, playlist);
            })
    }
}