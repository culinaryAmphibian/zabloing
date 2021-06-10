const ServerJSON = require('../../DB/servers.json');

module.exports =
{
    name: 'custom', hide: true,
    execute(message, bot)
    {
        let prefix = ServerJSON[message.guild.id].prefix || '.';
        if (ServerJSON[message.guild.id]?.disabled?.includes(message.content.slice(prefix.length))) return;
        let cmd = ServerJSON[message.guild.id].find(c => c.name == message.content.slice(prefix.length));
        let res = cmd.response;
        if (res.startsWith('[pref]'))
        {
            let args = res.slice('[pref]'.length).split(" ");
            message.content = prefix + args.join(" ");
            let triggeredCmd = bot.commands.find(c => c.name.includes(args[0]));
            if (triggeredCmd.hide) return;
            if (triggeredCmd && !ServerJSON[message.guild.id].disabled?.find(a => triggeredCmd.name.includes(a)))
            return triggeredCmd.execute(message, args, bot);
            else if (ServerJSON[message.guild.id].cmds?.find?.(c => c.name == (args.join(" "))))
            {
                if (ServerJSON[message.guild.id].cmds.find(cmd => cmd == args[0])) return;
                return bot.commands.get('custom').execute(message, bot);
            }
        }
        let attachmentArr = res.toLowerCase().split(' ').filter(j => j.match(/^https:\/\/([a-z0-9]+\.)+[a-z]{2,6}(\/[a-z0-9]+)+\.(mov|mp4|webm|png|jpg|jpeg|gif)$/gi));
        if (attachmentArr)
        {
            attachmentArr.forEach(i => i = {attachment: i});
            if (attachmentArr.length != res.length) return message.channel.send(res, {files:attachmentArr});
            return message.channel.send({files:attachmentArr});
        } else return message.channel.send(res);
    }
}