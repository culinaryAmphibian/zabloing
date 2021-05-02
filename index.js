const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const config = require('./DB/config.json');
const secret = require('./DB/secret.json');
const UserJSON = require('./DB/users.json');
const ServerJSON = require('./DB/servers.json');
let prefix = '.';

const Distube = require('distube');
bot.distube = new Distube(bot, {searchSongs:false, emitNewSongOnly:true});

bot.econCommands = new Discord.Collection();
const econCommandFiles = fs.readdirSync('./commands/econ/').filter(file => file.endsWith('.js'));
for(const econFile of econCommandFiles)
{
    const econCommand = require(`./commands/econ/${econFile}`);
    bot.econCommands.set(econCommand.name, econCommand);
}

bot.modCommands = new Discord.Collection();
const modCommandFiles = fs.readdirSync('./commands/mod/').filter(file => file.endsWith('.js'));
for(const modFile of modCommandFiles)
{
    const modCommand = require(`./commands/mod/${modFile}`);
    bot.modCommands.set(modCommand.name, modCommand);
}

bot.helpCommands = new Discord.Collection();
const helpCommandFiles = fs.readdirSync('./commands/help/').filter(file => file.endsWith('.js'));
for(const helpFile of helpCommandFiles)
{
    const helpCommand = require(`./commands/help/${helpFile}`);
    bot.helpCommands.set(helpCommand.name, helpCommand);
}

bot.miscCommands = new Discord.Collection();
const miscCommandFiles = fs.readdirSync('./commands/misc/').filter(file => file.endsWith('.js'));
for(const miscFile of miscCommandFiles)
{
    const miscCommand = require(`./commands/misc/${miscFile}`);
    bot.miscCommands.set(miscCommand.name, miscCommand);
}

bot.testCommands = new Discord.Collection();
const testCommandFiles = fs.readdirSync('./commands/test/').filter(file => file.endsWith('.js'));
for(const testFile of testCommandFiles)
{
    const testCommand = require(`./commands/test/${testFile}`);
    bot.testCommands.set(testCommand.name, testCommand);
}

bot.imgCommands = new Discord.Collection();
const imgCommandFiles = fs.readdirSync('./commands/img/').filter(file => file.endsWith('.js'));
for(const imgFile of imgCommandFiles)
{
    const imgCommand = require(`./commands/img/${imgFile}`);
    bot.imgCommands.set(imgCommand.name, imgCommand);
}

bot.util = new Discord.Collection();
const utilFiles = fs.readdirSync('./commands/util/').filter(file => file.endsWith('.js'));
for(const utilFile of utilFiles)
{
    const utilCommand = require(`./commands/util/${utilFile}`);
    bot.util.set(utilCommand.name, utilCommand);
}

bot.on('ready', () =>
{
    console.log('Online.');
    bot.user.setPresence({ activity: { name: 'aaaaaa' }, status: 'idle' });
    // bot.util.get('water').execute(bot);
});

bot.on("guildMemberAdd", member =>
{
    return bot.util.get('newMember').execute(member);
});

bot.on("guildMemberRemove", member =>
{
    return bot.util.get('oldMember').execute(member);
});

bot.on('guildCreate', guild =>
{
    return bot.util.get('serverJoin').execute(guild);
});

bot.on('message', async(message) =>
{
    if (message.author.bot) return;
    bot.util.get('userdb').execute(message, UserJSON, ServerJSON, bot);
    if (!message.guild) return;
    if (!message.guild.me.hasPermission('SEND_MESSAGES')) return message.author.send('I don\'t have the perms to send messages');
    var args = message.content.substr(prefix.length).toLowerCase().split(' ');
    if (UserJSON[message.author.id].ignore == true)
    {
        if (args[0] == 'unignore')
        {
            UserJSON[message.author.id].ignore = false;
            fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
            return message.channel.send('you will now be unignored!');
        }
    }
    // w/o prefix
    if (message.guild.id == '771350615560290335')
    {
        if (message.content.includes('thankus')) message.channel.send(config.imageLinks.images.thankus);
        if (message.content.includes('lisa')) message.channel.send(config.imageLinks.images.lisa);
        if (message.content.includes('birth')) message.channel.send(config.imageLinks.images.birth);
        if (message.content == 'why') return message.channel.send(config.imageLinks.images.why);
        if (message.content == 'sori') return message.channel.send({files:[{attachment:config.imageLinks.videos.sori}]});
        if (message.content == 'me lon') return message.channel.send(config.imageLinks.images.melon);
        if (message.content == 'le mon') return message.channel.send(config.imageLinks.images.lemon);
        if (message.content.includes('femboy')) message.channel.send(config.imageLinks.images.femboy);
        if (message.content.toLowerCase().includes('mad cat drip')) message.channel.send(config.imageLinks.images.madCatDrip);
        if (message.content.includes('👍')) bot.imgCommands.get('thumbcat').execute(message);
    }
    if (message.content == 'le fishe') return message.channel.send({files:[{attachment:config.imageLinks.videos.lefishe}]});
    if (message.content.includes(`<@!${bot.user.id}>`)) message.channel.send(`Hi! My prefix is ${prefix}`);
    // if (message.content.toLowerCase().startsWith('setprefix'))
    if (!message.content.startsWith(prefix)) return;

    global.eft = message.author.username;
    global.efi = message.author.displayAvatarURL({dynamic:true});
    global.currency = 'points';

    let a = args[0];
    if (config.imageLinks.images[a]) return message.channel.send(config.imageLinks.images[a]);
    if (config.imageLinks.videos[a]) return message.channel.send(config.imageLinks.videos[a]);

    if (a == 'john') return message.channel.send(`<:john:822616260638408724>`);

    if (a == 'onlyfans') return bot.imgCommands.get('of').execute(message);
    if (a == 'chiro') return bot.imgCommands.get('chiro').execute(message, args);
    if (a == 'kai') return bot.imgCommands.get('kai').execute(message, args);
    if (a == 'shishcat') return bot.imgCommands.get('shish').execute(message, args);
    if (a == 'istella') return bot.imgCommands.get('istella').execute(message, args);
    if (a == 'floppa') return bot.imgCommands.get('floppa').execute(message, args);

    if (a == 'bal') return bot.econCommands.get('bal').execute(message, args, UserJSON, bot);
    if (a == 'pay') return bot.econCommands.get('pay').execute(message, args, bot);
    if (a == 'daily') return bot.econCommands.get('daily').execute(message, UserJSON);
    if (a == 'leaderboard') return bot.econCommands.get('lb').execute(message, args, UserJSON);
    
    if (a == 'help') return bot.helpCommands.get('help').execute(message, args, prefix, bot);

    if (a == 'av') return bot.miscCommands.get('av').execute(message, args, prefix);
    if (a == 'say') return bot.miscCommands.get('say').execute(message, prefix);
    if (a == 'ignoreme') return bot.miscCommands.get('ignore').execute(message, args, UserJSON);
    if (a == 'ping') return bot.miscCommands.get('ping').execute(message, bot);
    if (a == 'addemoji') return bot.miscCommands.get('addemoji').execute(message, args);
    if (a == 'calc') return bot.miscCommands.get('calc').execute(message, args);
    if (a == 'firstmsg') return bot.miscCommands.get('firstmsg').execute(message, args);
    if (a == 'serverinfo') return bot.miscCommands.get('serverInfo').execute(message);
    if (a == 'ui') return bot.miscCommands.get('userinfo').execute(message, args);
    if (a == 'emoji') return bot.miscCommands.get('emojiUrl').execute(message, args, bot);
    if (['play', 'p', 'loop', 'skip', 'stop', 'pause', 'dc', 'leave', 'q', 'queue'].includes(a))
        return bot.miscCommands.get('musicHandler').execute(message, args, bot);
    if (a == 'translate') return bot.miscCommands.get('eng').execute(message, args);
    if (a == 'image') return bot.miscCommands.get('googleImages').execute(message, args);
    if (a == 'idk') return bot.miscCommands.get('hangman').execute(message);
    if (['color', 'colour'].includes(a)) return bot.miscCommands.get('col').execute(message, args);
    if (a == 'count') return bot.miscCommands.get('count').execute(message, args);

    if (a == 'purge') return bot.modCommands.get('purge').execute(message, args, bot);
    if (['kick', 'ban'].includes(a)) return bot.modCommands.get('kickban').execute(message, args, bot);

    if (a == 'tuf') return bot.testCommands.get('testingUserFinding').execute(message, args);
    if (a == 'cptch') return bot.testCommands.get('captcha').execute(message);
    
    if (a == 'addcmd') bot.util.get('addCmd').execute(message, args);

    if (a == 'kill')
    {
        if (message.author.id !== '550886249309929472') return;
        else process.exit();
    }
});  

bot.login(secret["token"]);