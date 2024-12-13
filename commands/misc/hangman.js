const Discord = require('discord.js');
const fs = require('fs');
const UserJSON = require('../../DB/users.json');
const db = require('../../DB/hman.json');
const config = require('../../DB/config.json');
const words = db["words"];
const cmdCooldown = config["cooldowns"].misc.hangman;
const hangmanImg = config["imageLinks"].hangmans;

const reason = 'hangman game';

function writeToUsers() {return fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));}
function writeToDB() {return fs.writeFileSync('./DB/hman.json', JSON.stringify(db, null, 2));}

async function JSONCheck(id, channel)
{
    if (!UserJSON[id].cooldowns.hangman) UserJSON[id].cooldowns.hangman = 0;
    if (!UserJSON[id].games.hangman) UserJSON[id].games.hangman = { playing: false, lastGameLink: 0, gamesPlayed: 0, gamesWon: 0, startedANewGame: false};
    writeToUsers();
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
        let filter = m => m.author.id == id &&
        (m.content.includes('y') || m.content.includes('n'));
        let j = await(channel.awaitMessages(filter, {max:1}))
        if (j.first().content.includes('n'))
        {
            channel.send(`alright, your last game started at ${UserJSON[id].games.hangman.lastGameLink}`);
            return 1;
        } else
        {
            channel.send('alright, you have been cleared to start a new game');
            UserJSON[id].games.hangman.startedANewGame = true;
            writeToUsers();
        }
    }
    UserJSON[id].games.hangman.playing = true;
    UserJSON[id].cooldowns.hangman = new Date().getTime();
    writeToUsers();
}

function generateWord()
{
    let used = db["used"];
    if (!words[0])
    {
        words = used;
        used = [];
        writeToDB();
    }
    let chosenIdx = words[Math.floor(Math.random() * words.length)];
    let removedWord = words.splice(chosenIdx, 1);
    used.push(removedWord[0]);
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

function niceDel(arr)
{
    while(arr[1])
    {
        arr.shift().delete({reason:reason});
    }
}

function editEmbed(embed, underScores, guessesLeft, guessArr, wordToGuess, time, won)
{
    let a = [];
    guessArr.forEach(element => {
        a.push(`"${element}", `);
    });
    if (guessesLeft == 0) won = 0;
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
                { name: `${config.currency} earned`, value: Math.round(points(wordToGuess, x, guessesLeft, time))}
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
    name: ['idk'], description: 'hangman game',
    async execute(message)
    {
        let jsoncheck = await(JSONCheck(message.author.id, message.channel));
        if (jsoncheck  == 1) return;
        let wordToGuess = generateWord();
        let guessCount = guessFromUniqueLetters(wordToGuess);
        let _guessesTakenArr = [];
        let mesArr = [];
        let won = 2;
        let _underScores = [];
        for (let i in wordToGuess.split(''))
        {
            _underScores.push("_");
        }
        let underScores = `\`\`${_underScores.join(" ")}\`\``;
        let mainEmbed =
        {
            color: global.blue, title: underScores, description: `good luck!`,
            image: { url: hangmanImg[0] },
            fields: [ { name: 'word length', value: wordToGuess.length },
            { name: 'guesses', value: guessCount} ], footer: global.footer
        };
        const mainMessage = await(message.channel.send({embeds:[mainEmbed]}));
        let t1 = UserJSON[message.author.id].cooldowns.hangman;
        UserJSON[message.author.id].games.hangman.lastGameLink = mainMessage.url;
        writeToUsers();
        const filter = m => m.author.id === message.author.id &&
        m.content.match(/^\w+$/gi) &&
        (m.content.length == 1 || m.content.length == wordToGuess.length);
        const collector = new Discord.MessageCollector(message.channel, filter);
        collector.on('collect', async(collected) =>
        {
            if (UserJSON[message.author.id].games.hangman.startedANewGame == true) return collector.stop();
            mesArr.push(collected);
            let time = Math.floor((new Date().getTime() - t1)/1000);
            let guess = collected.content.toLowerCase();
            if (guessCount > 0)
            {
                if (_guessesTakenArr.includes(guess))
                {
                    let mes = await message.channel.send('you already guessesed that!');
                    return mesArr.push(mes);
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
                            mesArr.push(mes);
                        } else
                        {
                            let mes = await(collected.channel.send('nice, you guessed a letter!'));
                            mesArr.push(mes);
                            mainMessage.edit({embed:editEmbed(mainEmbed, underScores, guessCount, _guessesTakenArr, wordToGuess, time, won)});
                        }
                    } else
                    {
                        won = 1;
                        // unique letters - correct guesses
                        if ((guessFromUniqueLetters(wordToGuess) - 4) - correctGuessesTakenNum(wordToGuess, _guessesTakenArr) == 1)
                        {
                            let mes = await(collected.channel.send('you just guessed the last letter, nice job! <:lao:792416659314180096>'));
                            mesArr.push(mes);
                        } else
                        {
                            let mes = await(message.channel.send('woah, you guessed the whole word!'));
                            mesArr.push(mes);
                        }
                    }
                } else
                {
                    guessCount--;
                    mainMessage.edit({embed:editEmbed(mainEmbed, underScores, guessCount, _guessesTakenArr, wordToGuess, time, won)})
                    let mes = await(message.channel.send('oops, that guess is incorrect'));
                    mesArr.push(mes);
                }
                if (mesArr.length > 4) niceDel(mesArr);
                if (won == 1) collector.stop();
            } else
            {
                won = 0;
                if (mesArr.length > 4) niceDel(mesArr);
                return collector.stop();
            }
        });
        collector.on('end', () =>
        {
            mesArr.forEach(e => e.delete());
            UserJSON[message.author.id].games.hangman.playing = false;
            if (UserJSON[message.author.id].games.hangman.startedANewGame == true)
            {
                let bruhEmbed = { title: 'this game was cancelled', description: `the word was ${wordToGuess}`, footer: global.footer };
                mainMessage.edit({embed:bruhEmbed});
                UserJSON[message.author.id].games.hangman.startedANewGame = false;
                return writeToUsers();
            }
            UserJSON[message.author.id].games.hangman.gamesPlayed++;
            let timediff = new Date().getTime() - t1;
            UserJSON[message.author.id].cooldowns.hangman = new Date().getTime();
            mainMessage.edit({embed:editEmbed(mainEmbed, underScores, guessCount, _guessesTakenArr, wordToGuess, timediff, won)});
            if (won == 1)
            {
                UserJSON[message.author.id].games.hangman.gamesWon++;
                let x = (guessFromUniqueLetters(wordToGuess) - 4) - correctGuessesTakenNum(wordToGuess, _guessesTakenArr);
                UserJSON[message.author.id].games.bal += Math.round(points(wordToGuess, x, guessCount, timediff));
            }
            return writeToUsers();
        });
    }
}