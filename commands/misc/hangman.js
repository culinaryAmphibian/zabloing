const Discord = require('discord.js');
const fs = require('fs');
const UserJSON = require('../../DB/users.json');
const db = require('../../DB/hangman.json');
const config = require('../../shhh/config.json');
const words = db["words"];
const cmdCooldown = config["cooldowns"].misc.hangman;
const hangmanImg = config["imageLinks"].hangmans

const reason = 'hangman game';

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

function writeToUsers() {return fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2))}
function writeToDB() {return fs.writeFileSync('./DB/hangman.json', JSON.stringify(db, null, 2))}

async function JSONCheck(id, channel)
{
    if (!UserJSON[id].cooldowns.hangman) UserJSON[id].cooldowns.hangman = 0;
    if (!UserJSON[id].bal) UserJSON[id].games.bal = 0;
    if (!UserJSON[id].games.hangman) UserJSON[id].games.hangman = {};
    if (!UserJSON[id].games.hangman.gamesPlayed) UserJSON[id].games.hangman.gamesPlayed = 0;
    if (!UserJSON[id].games.hangman.gamesWon) UserJSON[id].games.hangman.gamesWon = 0; 
    writeToUsers();
    let subtraction = (new Date().getTime() - UserJSON[id].cooldowns.hangman);
    let minTime = cmdCooldown - subtraction;
    if (subtraction < cmdCooldown)
    {
        channel.send(`you can play again in ${Math.round(minTime/1000)} seconds.`);
        return 'n';
    }
    let y = 0;
    if (UserJSON[id].playing == true)
    {
        channel.send('you haven\'t finished a game, do you want to start a new one?');
        const filter = m => m.author.id === id && m.channel === channel && (m.content.includes('y') || (m.content.includes('n')));
        const collector = await channel.awaitMessages(filter, {max:1}).then(res =>
        {
            if (res.first().content.includes('n'))
            {
                y = 'n';
                channel.send(`got it, your last game started at ${UserJSON[id].lastGameLink}.`);
            }
            else channel.send('alright, starting a new game');
        });
    } else
    {
        UserJSON[id].playing = true;
        writeToUsers();
    }
    return y;
}

function generateWord()
{
    if (words.length == db["used"].length)
    {
        db["used"] = [];
        writeToDB();
    }
    let unusedWordIdx = [];
    for (let i in words)
    {
        if (!db["used"].includes(words[i])) unusedWordIdx.push(i);
    }
    const chosen = words[ unusedWordIdx[ Math.floor(Math.random() * unusedWordIdx.length) ] ];
    db["used"].push(chosen);
    writeToDB();
    return chosen;
}

function guesses(str)
{
    let originalLetters = [];
    for (let i = 0; i < str.length; i++)
    {
        if (!originalLetters.includes(str[i])) originalLetters.push(str[i]);
    }
    return originalLetters.length + 4;
}

function charChk(str)
{
    let k = 0;
    for (let i = 0; i < str.length; i++)
    {
        if ( (str.charAt(i) < "A") || (str.charAt(i) > "z") ) k = 1;
    }
    return k;
}

function imgSelect(guessLeft, totalAllowed, won)
{
    if (guessLeft == 0) return hangmanImg[11];
    if (won) if (won == 1) return hangmanImg[12];
    if (guessLeft == totalAllowed) return hangmanImg[0];
    let idxEquation = Math.floor( ( (totalAllowed - guessLeft) / totalAllowed ) * (hangmanImg.length - 2) );
    // console.log(`total guesses - ${totalAllowed}`);
    // console.log(`current guesses - ${guessLeft}`);
    // console.log(`maths - ${idxEquation}`);
    // console.log(`image link - ${hangmanImg[idxEquation]}`);
    return hangmanImg[idxEquation];
}

function replaceThing(str, word, item)
{
    let arr = str.split('');
    for (let i = 0; i < word.length; i++)
    {
        if (word[i] == item) arr.splice(i, 1, item);
    }
    return arr;
}

async function reminderMessageThingy(channel, content, timeout)
{
    let a = await(channel.send(content));
    return a.delete({timeout:timeout, reason:reason});
}

// replace with regex

function instances(str, charToFind)
{
    let k = 0;
    for (let i = 0; i < str.length; i++)
    {
        if (str[i] == charToFind) k++;
    }
    return k;
}

function points(word, /* lettersLeft,*/ guessesLeft, time)
{
    wordLengthCoeff = 1.75/2;
    // lettersLeftCoeff = 2;
    guessesLeftCoeff = 2.25/2;
    timeCoeff = 3/2;
    if (time > (guesses(word) * 20)) time = (guesses(word) * 20) - 5;

    return (wordLengthCoeff * word.length) + /* (lettersLeftCoeff * lettersLeft) + */ (guessesLeftCoeff * guessesLeft) + (( (guesses(word) * 15) - time ) * timeCoeff);
}

function editEmbed(embed, undaScores, guessesLeft, pastGuessArr, points, time, wordToGuess, won)
{
    if (won == 1)
    {
        embed.title = `victory!`;
        embed.description = `you won the game with **${guessesLeft}** guesses left!`;
        embed.image = {url:hangmanImg[12]};
        embed.fields = [ { name: 'time', value: `${time} seconds`}, { name: 'points earned', value: `${points} points` } ];
        return embed;
    }
    if (won == 'lost')
    {
        embed.title = `aw, you lost. better luck next time!`;
        embed.description = `the word was ${wordToGuess}`;
        embed.image = {url:hangmanImg[11]};
        delete embed.fields;
        return embed;
    }
    embed.title = `\`\`${undaScores}\`\``;
    embed.image = {url: imgSelect(guessesLeft, guesses(wordToGuess))},
    embed.fields = [ {name: 'guesses left', value: guessesLeft}, {name: 'past guesses', value: pastGuessArr.join(``).slice(0, -2)}];
    return embed;
}

module.exports =
{
    name: 'hangman', description: 'a game of hangman',
    async execute(message)
    {
        let jsontingz = await(JSONCheck(message.author.id, message.channel));
        if (jsontingz == 'n') return;
        let wordToGuess = generateWord();
        let guessesss = guesses(wordToGuess);
        let guessesTaken = [];
        let secondGuessesTakenArr = [];
        let won = 0;
        let undScores = "";
        let _undScores = "";
        for (let i = 0; i < wordToGuess.length; i++)
        {
            _undScores += "_";
        }
        let mainEmbed =
        {
            color: blueCol, title: `\`\`${_undScores.split('').join(" ")}\`\``, description: `the word is ${wordToGuess.length} letters long, good luck!`,
            image: {url:imgSelect(guessesss, guessesss)},
            fields: [ { name: 'word length', value: wordToGuess.length }, { name: 'guesses remaining', value: guessesss} ],
            footer: {text: global.eft, icon_url: global.efi}
        };
        const mainMessage = await(message.channel.send({embed:mainEmbed}));
        UserJSON[message.author.id].lastGameLink = mainMessage.url;
        UserJSON[message.author.id].cooldowns.hangman = new Date().getTime();
        writeToUsers();
        const filter = m => m.author.id === message.author.id &&
        charChk(m.content) == 0 &&
        (m.content.length == 1 || m.content.length == wordToGuess.length);
        let time = (new Date().getTime() - UserJSON[message.author.id].cooldowns.hangman)/1000;
        let award = points(wordToGuess, guessesss, time);
        const collector = new Discord.MessageCollector(message.channel, filter);
        console.log('new game started');
        collector.on('collect', async(collected) =>
        {
            const guess = collected.content.toLowerCase();
            if (guessesss > 0)
            {
                if (guessesTaken.includes(guess))
                {
                    await reminderMessageThingy(collected.channel, 'you already guessed that!', 1000);
                    collected.delete({timeout:1000, reason:reason});
                }
                guessesTaken.push(guess);
                secondGuessesTakenArr.push(`"${guess}", `);
                slowUndScores = undScores;
                _undScores = replaceThing(_undScores, wordToGuess, guess).join('');
                undScores = _undScores.split('').join(" ");
                if (wordToGuess.includes(guess))
                {
                    if (guessesTaken.length > 3) delete mainEmbed.description;
                    time = (new Date().getTime() - UserJSON[message.author.id].cooldowns.hangman)/1000;
                    if (guess.length == 1)
                    {
                        if (instances(undScores, "_") == 0)
                        {
                            won = 1;
                            mainMessage.edit({embed:editEmbed(mainEmbed, undScores, guessesss, secondGuessesTakenArr, Math.round(award), time, wordToGuess, won)});
                            await reminderMessageThingy(collected.channel, 'nice, you guessed the last letter!', 1250);
                        } else
                        {
                            mainMessage.edit({embed:editEmbed(mainEmbed, undScores, guessesss, secondGuessesTakenArr, Math.round(award), time, wordToGuess, 0)});
                            await reminderMessageThingy(collected.channel, 'nice, you guessed a letter!', 1000);
                        }
                    } else
                    {
                        won = 1;
                        mainMessage.edit({embed:editEmbed(mainEmbed, undScores, guessesss, secondGuessesTakenArr, Math.round(award), time, wordToGuess, won)});
                        // if (instances(slowUndScores, "_") > 1)
                        // {
                        //     let woah = await(message.channel.send('you just guessed the last letter, nice job! <:lao:792416659314180096>'));
                        //     woah.delete({timeout:1500, reason:reason});
                        // } else
                        // {
                        await reminderMessageThingy(collected.channel, 'woah, you guessed the whole word!', 1000);
                        // }
                    }
                } else
                { 
                    guessesss--;
                    mainMessage.edit({embed:editEmbed(mainEmbed, undScores, guessesss, secondGuessesTakenArr, Math.round(award), time, wordToGuess, 0)});
                    await reminderMessageThingy(collected.channel, `oops, that guess is incorrect`, 1000);
                }
                collected.delete({reason:reason});
                if (won == 1) return collector.stop();
            } else return collector.stop();
        });
        collector.on('end', async() =>
        {
            UserJSON[message.author.id].gamesPlayed++;
            UserJSON[message.author.id].playing = false;
            time = (new Date().getTime() - UserJSON[message.author.id].cooldowns.hangman)/1000;
            writeToUsers();
            if (won == 1) return mainMessage.edit({embed:editEmbed(mainEmbed, undScores, guessesss, secondGuessesTakenArr, Math.round(award), time, wordToGuess, won)});
            else
            {
                guessesss = 0;
                return mainMessage.edit({embed:editEmbed(mainEmbed, undScores, guessesss, secondGuessesTakenArr, Math.round(award), time, wordToGuess, 'lost')});
            }
        });
    }
}