const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const av = require('./commands/misc/av');
const secret = require('./shhh/secret.json');
const config = JSON.parse(fs.readFileSync('./shhh/config.json'));
const UserJSON = JSON.parse(fs.readFileSync('./DB/users.json'));
const prefix = '.';

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

bot.on('ready', () =>
{
    console.log('Online.');
    bot.user.setPresence({ activity: { name: 'aaaaaa' }, status: 'idle' });

});

bot.on('message', async(message) =>
{
    if (message.author.bot) return;
    if (!message.guild) return;
    bot.miscCommands.get('userdb').execute(message, UserJSON);
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
    if (message.content == 'why') message.channel.send(config.imageLinks.why);
    if (message.content == 'sori') bot.imgCommands.get('sori').execute(message);
    if (message.content == 'me lon') message.channel.send(config.imageLinks.melon);
    if (message.content.includes('femboy')) message.channel.send(config.imageLinks.femboy);
    if (message.content.toLowerCase().includes('mad cat drip')) message.channel.send(config.imageLinks.madCatDrip);
    if (message.content.includes('👍'))
    {
        message.react('👍');
        let thumbsUpCat = new Discord.MessageAttachment(config.imageLinks.thumbsUpCat);
        message.channel.send(thumbsUpCat);
    }
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
            bot.miscCommands.get('av').execute(message, args);
            break;
        case 'say':
            bot.miscCommands.get('say').execute(message, prefix);
            break;
        case 'count':
            bot.miscCommands.get('count').execute(message, args, bot);
            break;
        case 'ignoreme':
            bot.miscCommands.get('ignore').execute(message, args, UserJSON);
            break;
        case 'help':
            bot.helpCommands.get('help').execute(message, args, prefix);
            break;
        case 'purge':
            bot.modCommands.get('purge').execute(message, args, bot);
            break;
        case 'stop':
            if (message.author.id !== '550886249309929472') return;
            else process.exit();
        // monkimeme
        
    }
})

bot.login(secret["token"]);