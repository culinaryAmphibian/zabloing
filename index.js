const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const secret = require('./shhh/secret.json');
const config = JSON.parse(fs.readFileSync('./shhh/config.json'));
const UserJSON = JSON.parse(fs.readFileSync('./DB/users.json'));
const prefix = '.';
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

bot.musicCommands = new Discord.Collection();
const musicCommandFiles = fs.readdirSync('./commands/misc/music').filter(file => file.endsWith('.js'));
for (const musicFile of musicCommandFiles)
{
    const musicCommand = require(`./commands/misc/music/${musicFile}`);
    bot.musicCommands.set(musicCommand.name, musicCommand);
}

bot.on('ready', () =>
{
    console.log('Online.');
    bot.user.setPresence({ activity: { name: 'aaaaaa' }, status: 'idle' });

});

bot.on("guildMemberAdd", member =>
{
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome');
    welcomeChannel.send(`Welcome, ${member}!`);
});

bot.on("guildMemberRemove", member =>
{
    const goodbyeChannel = member.guild.channels.cache.find(c => c.name === 'bye')
    goodbyeChannel.send(`aw rip ${member.tag} left :(((`)
});

bot.on('message', async(message) =>
{
    bot.miscCommands.get('userdb').execute(message, UserJSON);
    bot.miscCommands.get('water').execute(message, UserJSON);
    if (message.author.bot) return;
    if (!message.guild) return;
    var args = message.content.substr(prefix.length).toLowerCase().split(' ');
    if (UserJSON[message.author.id].ignore == true)
    {
        if (args[0] == 'unignore')
        {
            UserJSON[message.author.id].ignore = false;
            fs.writeFileSync("./DB/users.json", JSON.stringify(UserJSON, null, 2));
            message.channel.send('you will now be unignored!');
            return;
        }
        return;
    }
    // w/o prefix
    if (message.content.includes('thankus')) message.channel.send(config.imageLinks.thankus);
    if (message.content.includes('lisa')) message.channel.send(config.imageLinks.lisa);
    if (message.content.includes('birth')) message.channel.send(config.imageLinks.birth);
    if (message.content == 'why') return message.channel.send(config.imageLinks.why);
    if (message.content == 'sori') return bot.imgCommands.get('sori').execute(message);
    if (message.content == 'me lon') return message.channel.send(config.imageLinks.melon);
    if (message.content == 'le mon') return message.channel.send(config.imageLinks.lemon);
    if (message.content == 'le fishe') return bot.imgCommands.get('lefishe').execute(message);
    if (message.content.includes('femboy')) message.channel.send(config.imageLinks.femboy);
    if (message.content.toLowerCase().includes('mad cat drip')) message.channel.send(config.imageLinks.madCatDrip);
    if (message.content.includes('👍')) bot.imgCommands.get('thumbcat').execute(message);
    if (message.content == `<@!${bot.user.id}>`) return message.channel.send(`My prefix is ${prefix}`);
    if (!message.content.startsWith(prefix)) return;

    global.eft = message.author.username;
    global.efi = message.author.displayAvatarURL({dynamic:true});

    switch (args[0])
    {
        case 'zabloing':
            message.channel.send(config.imageLinks.zabloing);
            break;
        case 'googas':
            message.channel.send(config.imageLinks.googas);
            break;
        case 'gronch':
            message.channel.send(config.imageLinks.gronch);
            break;
        case 'lfao':
            message.channel.send(config.imageLinks.lfao);
            break;
        case 'lao':
            message.channel.send(config.imageLinks.lao);
            break;
        case 'spong':
            message.channel.send(config.imageLinks.spong);
            break;
        case 'ganca':
            message.channel.send(config.imageLinks.thankus);
            break;
        case 'onlyfans':
            bot.imgCommands.get('of').execute(message);
            break;
        case 'single':
            message.channel.send(config.imageLinks.single);
            break;
        case 'shishcat':
            bot.imgCommands.get('shish').execute(message, args);
            break;
        case 'sessogatto':
            message.channel.send(config.imageLinks.sessogatto);
            break;
        case 'snowducc':
            message.channel.send(config.imageLinks.snowducc);
            break;
        case 'zingus':
            message.channel.send(config.imageLinks.zingus);
            break;
        case 'gangstaspongebob':
            message.channel.send(config.imageLinks.gangstaspongebob);
            break;
        case 'chiro':
            bot.imgCommands.get('chiro').execute(message, args);
            break;
        case 'kai':
            bot.imgCommands.get('kai').execute(message, args);
            break;
        case 'istella':
            bot.imgCommands.get('istella').execute(message, args);
            break;
        case 'floppa':
            bot.imgCommands.get('floppa').execute(message, args);
            break;
        case 'woo':
            bot.imgCommands.get('woo').execute(message);
            break;
        case 'av':
            bot.miscCommands.get('av').execute(message, args, prefix);
            break;
        case 'say':
            bot.miscCommands.get('say').execute(message, prefix);
            break;
        case 'hm':
            bot.miscCommands.get('hangman').execute(message, args);
            break;
        case 'count':
            bot.miscCommands.get('count').execute(message, args, bot);
            break;
        case 'ignoreme':
            console.log(message.attachments);
            bot.miscCommands.get('ignore').execute(message, args, UserJSON);
            break;
        case 'addemoji':
            bot.miscCommands.get('addemoji').execute(message, args, bot);
            break;
        case 'help':
            bot.helpCommands.get('help').execute(message, args, prefix, bot);
            break;
        case 'calc':
            bot.miscCommands.get('calc').execute(message, args);
            break;
        case 'play':
            bot.miscCommands.get('musicHandler').execute(message, args, bot);
            break;
        case 'loop':
            bot.miscCommands.get('musicHandler').execute(message, args, bot);
            break;
        case 'stop':
            bot.miscCommands.get('musicHandler').execute(message, args, bot);
            break;
        case 'skip':
            bot.miscCommands.get('musicHandler').execute(message, args, bot);
            break;
        case 'queue':
            bot.miscCommands.get('musicHandler').execute(message, args, bot);
            break;
        case 'eng':
            bot.miscCommands.get('eng').execute(message, args, prefix)
            break;
        case 'purge':
            bot.modCommands.get('purge').execute(message, args, bot);
            break;
        case 'idk':
            bot.testCommands.get('msgcollector').execute(message, UserJSON);
            break;
        case 'john':
            message.channel.send(`<:john:822616260638408724>`);
            break;
        case 'stop':
            if (message.author.id !== '550886249309929472') return;
            else process.exit();
    }
});  

bot.login(secret["token"]);