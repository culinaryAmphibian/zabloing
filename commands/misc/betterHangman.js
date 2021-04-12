const Discord = require('discord.js');
const fs = require('fs');
const UserJSON = require('../../DB/users.json');
const db = require('../../DB/hman.json');
const config = require('../../DB/config.json');
const words = db["words"];
const cmdCooldown = config["cooldowns"].misc.hangman;
const hangmanImg = config["imageLinks"].hangmans;

const reason = 'hangman game';
let deleteTime = 1200;

let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

function writeToDB() {return fs.writeFileSync('./DB/hman.json', JSON.stringify(db, null, 2));}

async function JSONCheck(id, channel)
{
    if (!UserJSON[id].cooldowns.hangman) UserJSON[id].cooldowns.hangman = 0;
    if (!UserJSON[id].games.hangman) UserJSON[id].games.hangman = { playing: false, lastGameLink: 0, gamesPlayed: 0, gamesWon: 0};
    fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
    let subtraction = ( new Date().getTime() - UserJSON[id].cooldowns.hangman);
    let minTime = (cmdCooldown - subtraction)/1000;
    if (subtraction < cmdCooldown)
    {
        channel.send(`you can play again in ${Math.round(minTime)} seconds.`);
        return 1;
    }
    if (UserJSON[id].games.hangman.playing == true)
    {
        channel.send('you haven\'t finished a game, do you want to start a new one?');
        let filter = m => m.author.id == id && m.channel === channel &&
        (m.content.includes('y') || m.content.includes('n'));
        await channel.awaitMessages(filter, {max:1}).then(response =>
        {
            if (response.first().content.includes('n'))
            {
                channel.send(`alright, your last game started at ${UserJSON[id].games.hangman.lastGameLink}`);
                return 1;
            } else channel.send('alright, starting a new game');
        });
    }
    UserJSON[id].games.hangman.playing = true;
    UserJSON[id].cooldowns.hangman = new Date().getTime();
    fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
}

function generateWord()
{
    let used = db["used"];
    if (used.length == words.length)
    {
        used = [];
        writeToDB();
    }
    let unusedIdxArr = [];
    for (let i of words)
    {
        if (!used.includes(i)) unusedIdxArr.push(words.indexOf(i));
    }
    let chosenIdx = unusedIdxArr[Math.floor(Math.random() * unusedIdxArr.length)];
    db["used"].push(words[chosenIdx]);
    writeToDB();
    return used[used.length - 1];
}

// explore reduce function

function guessFromUniqueLetters(str)
{
    let originalLettersArr = [];
    for (let i of str.split(""))
    {
        if (!originalLettersArr.includes(i)) originalLettersArr.push(i);
    }
    return originalLettersArr.length + 4;
}

function charChk(str)
{
    let k = 0;
    for (let i of str.split(""))
    {
        if ((i < "A") || (i > "z")) k = 1;
    }
    return k;
}

function correctGuessesTakenNum(word, guessesTakenArr)
{
    let k = 0;
    for (let i of guessesTakenArr)
    {
        if (word.includes(i)) k++;
    }
    return k;
}

function imgSelect(guessesLeft, total)
{
    let wrongGuessesTaken = total - guessesLeft;
    let idx = Math.floor( (wrongGuessesTaken/total)  * (hangmanImg.length - 2));
    return hangmanImg[idx];
}

function replaceUndScores(str, word, guess)
{
    let arr = str.split("");
    for (let i in arr)
    {
        if (word[i] == guess) arr.splice(i, 1, guess);
    }
    return arr;
}

function points(word, lettersLeft, guessesLeft, time)
{
    let wordLengthCoeff = 1.75;
    let lettersLeftCoeff = 2;
    let guessesLeftCoeff = 2.25;
    let timeCoeff = 3;
    if (time > (guessFromUniqueLetters(word) * 20)) time = (guessFromUniqueLetters(word) * 20) - 5;
    return Math.round((wordLengthCoeff * word.length) + (lettersLeftCoeff * lettersLeft) + (guessesLeftCoeff * guessesLeft) + (timeCoeff * time/1000)) * 2;
}

function editEmbed(embed, underScores, guessesLeft, guessArr, wordToGuess, time, won)
{
    let a = [];
    guessArr.forEach(element => {
        a.push(`"${element}", `);
    });
    switch(won)
    {
        case 1:
        {
            let x = (guessFromUniqueLetters(wordToGuess) - 4) - correctGuessesTakenNum(wordToGuess, guessArr);
            embed.title = 'victory!';
            embed.description = `you won the game with **${guessesLeft}** guesses left!`;
            embed.image.url = hangmanImg[12];
            embed.fields =
            [
                { name: 'time', value: `${Math.round(time/1000)} seconds`},
                { name: 'points earned', value: Math.round(points(wordToGuess, x, guessesLeft, time))}
            ];
            break;
        }
        case 0:
        {
            embed.title = `aw, you lost. the word was ${wordToGuess}`;
            embed.description = `better luck next time!`;
            delete embed.fields;
            embed.image.url = hangmanImg[11];
            break;
        }
        default:
        {
            embed.title = underScores;
            embed.image.url = imgSelect(guessesLeft, guessFromUniqueLetters(wordToGuess));
            embed.fields =
            [
                { name: 'guesses left', value: `${guessesLeft} guesses Left`},
                { name: 'guesses taken', value: a.join("").slice(0, -2)}
            ];
            break;
        }
    }
    return embed;
}

module.exports =
{
    name: 'hangman', description: 'hangman game',
    async execute(message)
    {
        let jsoncheck = await(JSONCheck(message.author.id, message.channel));
        if (jsoncheck  == 1) return;
        let wordToGuess = generateWord();
        let guessCount = guessFromUniqueLetters(wordToGuess);
        let _guessesTakenArr = [];
        let won = 2;
        let _underScores = [];
        for (let i in wordToGuess.split(""))
        {
            _underScores.push("_");
        }
        let underScores = `\`\`${_underScores.join(" ")}\`\``;
        let mainEmbed =
        {
            color: blueCol, title: underScores, description: `good luck!`,
            image: { url: hangmanImg[0] },
            fields: [ { name: 'word length', value: wordToGuess.length },
            { name: 'guesses', value: guessCount} ],
            footer: {text: global.eft, icon_url: global.efi}
        };
        const mainMessage = await(message.channel.send({embed:mainEmbed}));
        let t1 = UserJSON[message.author.id].cooldowns.hangman;
        UserJSON[message.author.id].games.hangman.lastGameLink = mainMessage.url;
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        const filter = m => m.author.id === message.author.id &&
        charChk(m.content) == 0 &&
        (m.content.length == 1 || m.content.length == wordToGuess.length);
        const collector = new Discord.MessageCollector(message.channel, filter);
        collector.on('collect', async(collected) =>
        {
            let time = Math.floor((new Date().getTime() - t1)/1000);
            let guess = collected.content.toLowerCase();
            if (guessCount > 0)
            {
                if (_guessesTakenArr.includes(guess))
                {
                    let mes = await message.channel.send('you already guessesed that!');
                    return mes.delete({timeout:deleteTime, reason:reason});
                }
                _guessesTakenArr.push(guess);
                _underScores = replaceUndScores(_underScores.join(""), wordToGuess, guess);
                underScores = `\`\`${_underScores.join(" ")}\`\``;
                if (wordToGuess.includes(guess))
                {
                    if (guess.length == 1)
                    {
                        if (!_underScores.includes("_"))
                        {
                            won = 1;
                            let mes = await(collected.channel.send('nice, you guessed the last letter!'));
                            mes.delete({timeout:deleteTime, reason:reason});
                        } else
                        {
                            let mes = await(collected.channel.send('nice, you guessed a letter!'));
                            mes.delete({timeout:deleteTime, reason:reason});
                            mainMessage.edit({embed:editEmbed(mainEmbed, underScores, guessCount, _guessesTakenArr, wordToGuess, time, won)});
                        }
                    } else
                    {
                        won = 1;
                        // unique letters - correct guesses
                        if ((guessFromUniqueLetters(wordToGuess) - 4) - correctGuessesTakenNum(wordToGuess, _guessesTakenArr) == 1)
                        {
                            let mes = await(collected.channel.send('you just guessed the last letter, nice job! <:lao:792416659314180096>'));
                            mes.delete({timeout:deleteTime, reaosn:reason});
                        } else
                        {
                            let mes = await(message.channel.send('woah, you guessed the whole word!'));
                            mes.delete({timeout:deleteTime, reason: reason});
                        }
                    }
                } else
                {
                    guessCount--;
                    mainMessage.edit({embed:editEmbed(mainEmbed, underScores, guessCount, _guessesTakenArr, wordToGuess, time, won)})
                    let mes = await(message.channel.send('oops, that guess is incorrect'));
                    mes.delete({timeout:deleteTime, reason:reason});
                }
                collected.delete({reason:reason});
                if (won == 1) collector.stop();
            } else
            {
                won = 0;
                return collector.stop();
            }
        });
        collector.on('end', () =>
        {
            UserJSON[message.author.id].games.hangman.gamesPlayed++;
            UserJSON[message.author.id].games.hangman.playing = false;
            let timediff = new Date().getTime() - t1;
            UserJSON[message.author.id].cooldowns.hangman = new Date().getTime();
            mainMessage.edit({embed:editEmbed(mainEmbed, underScores, guessCount, _guessesTakenArr, wordToGuess, timediff, won)});
            if (won == 1)
            {
                UserJSON[message.author.id].games.hangman.gamesWon++;
                let x = (guessFromUniqueLetters(wordToGuess) - 4) - correctGuessesTakenNum(wordToGuess, _guessesTakenArr);
                UserJSON[message.author.id].games.bal += Math.round(points(wordToGuess, x, guessCount, timediff));
            }
            return fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        });
    }
}