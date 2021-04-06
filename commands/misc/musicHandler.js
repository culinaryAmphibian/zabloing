module.exports =
{
    name: 'musicHandler', description: 'mhm yeah',
    async execute(message, args, bot)
    {
        if (message.author.id !== 550886249309929472) return;
        let vc = message.member.voice.channel;
        if (!vc) return message.channel.send('join a voice channel first!');
        if (!vc.joinable) return message.channel.send('I don\'t have the perms to connect to that voice channel');
        if (!vc.speakable) return message.channel.send('I don\'t have the perms to speak in that voice channel');
        vc.join();

        const cmd = args.shift();

        if (['play', 'p'].includes(cmd)) return bot.distube.play(message, args.join(" "));

        if (["repeat", "loop"].includes(cmd)) return bot.distube.setRepeatMode(message);

        if (cmd == "stop")
        {
            bot.distube.stop(message);
           return message.channel.send("Stopped the music!");
        }

        if (['dc', 'leave'].includes(cmd)) return vc.leave();
        
        if (cmd == "skip") return bot.distube.skip(message);
        
        if (cmd == "queue")
        {
            let queue = bot.distube.getQueue(message);
            return message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
                `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
            ).slice(0, 10).join("\n"));
        }
        
        if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(cmd))
        {
            let filter = bot.distube.setFilter(message, cmd);
            return message.channel.send("Current queue filter: " + (filter || "Off"));
        }

        const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
        bot.distube
            .on("playSong", (message, song) =>
            {
                message.channel.send(
                `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
                );
                console.log('a song was added')
            })
            .on("addSong", (message, song) => message.channel.send(
                `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
            ))
            .on("playList", (message, queue, playlist, song) => message.channel.send(
                `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
            ))
            .on("addList", (message, queue, playlist) => message.channel.send(
                `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
            ))
            .on("error", (message, e) => {
                console.error(e)
                message.channel.send("An error encountered: " + e);
            });
    }
}