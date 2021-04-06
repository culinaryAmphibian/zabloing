const Discord = require('discord.js');
const fs = require('fs');
const db = require('../../DB/hangman.json');
const words = db["words"];
const used = db["used"];

function generateWord()
{
    if (used.length == words.length)
    {
        used = [];
        fs.writeFileSync('./DB/hangman.json', JSON.stringify(db, null, 2) );
    }
    let unusedWordsIdx = [];
    for (let x = 0; x < words.length; x++)
    {
        if (!used.includes(words[x]))
        {
            unusedWordsIdx.push(x);
        }
    }
    const chosen = words[unusedWordsIdx[Math.floor(Math.random() * unusedWordsIdx.length)]];
    used.push(chosen);
    fs.writeFileSync('./DB/hangman.json', JSON.stringify(db, null, 2));
    return used[used.length - 1];
}

function guesses(str)
{
    let strArray = str.split('');
    let list = [];
    let k = 0;
    let i;
    for (i = 0; i < str.length; i++)
    {
        if (!list.includes(strArray[i]))
        {
            k++;
            list.push(strArray[i]);
        }
    }
    return k + 3;
}

function charChk(str)
{
    let arr = [];
    for (let a = 0; a < str.length; a++)
    {
        if ( (str.charAt(a) > "z") || (str.charAt(a) < "a") )
        {
            arr.push(1);
        }
    }
    if (arr.includes(1)) return arr.join('').replace(/[^1]/g, "").length;
    else return 0;
}

function replaceThing(str, word, guess)
{
    let arr = str.split('');
    for (let i = 0; i < word.length; i++)
    {
        if (word[i] == guess)
        {
            arr.splice(i, 1, guess);
        }
    }
    return arr;
}

module.exports =
{
    name: 'msgcollector', description: 'just a test',
    async execute(message, UserJSON)
    {
        if (UserJSON[message.author.id].inGame == true)
        {
            message.channel.send('you\'re already playing a game! do you want to quit it?');
            let filter = m => m.author.id === message.author.id && (m.content.includes('y') || m.content.includes('n'));
            let collector = new Discord.MessageCollector(message.channel, filter, {time:3000, max:1});
            collector.on('collect', async(collected) =>
            {
                if (collected.content.includes('y'))
                {
                    message.channel.send('alright, forfeiting your game...');
                    UserJSON[message.author.id].inGame = false;
                    return fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
                } else
                {
                    message.channel.send('alright! your word was ' + UserJSON[message.author.id].lastWordPlayedFor);
                }
                collector.stop();
            });
        } else UserJSON[message.author.id].inGame = true;
        message.channel.send('you have intialized a protoype game of hangman');
        let wordToGuess = generateWord();
        UserJSON[message.author.id].lastWordPlayedFor = wordToGuess;
        fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        let undScores = "";
        let secretUndScores = "";
        let guessesTaken = [];
        let i;
        for (i = 0; i < wordToGuess.length; i++)
        {
            undScores += "_ ";
            secretUndScores += "_";
        }
        let prog = await(message.channel.send("``" + undScores + "``" + ` (the word is ${wordToGuess.length} letters long, and you have ${guesses(wordToGuess)} guesses; good luck!)`));
        let filter = (m) => m.author.id == message.author.id && charChk(m.content) == 0 && (m.content.length == 1 || m.content.length == wordToGuess.length);
        const collector = new Discord.MessageCollector(message.channel, filter, {time:guesses(wordToGuess) * 1000 * 50});
        i = 1;
        let y;
        collector.on('collect', async(collected) =>
        {
            if ((guesses(wordToGuess) - guessesTaken.length) > 1)
            {
                let guess = collected.content.toLowerCase();
                if (guessesTaken.includes(guess))
                {
                    let hm = await(message.channel.send('you already guessed that!'));
                    return hm.delete({timeout:500});
                }
                guessesTaken.push(guess);
                if (wordToGuess.includes(guess))
                {
                    if (guess.length == 1)
                    {
                        secretUndScores = replaceThing(secretUndScores, wordToGuess, guess).join('');
                        undScores = secretUndScores.split('').join(" ");
                        prog.edit(`${"``" + undScores + "``"} (you now have ${guesses(wordToGuess) - guessesTaken.length} guesses left)`);
                        let nice = await(message.channel.send('nice, you guessed a letter, but you have ' + `${guesses(wordToGuess) - guessesTaken.length} guesses left`));
                        nice.delete({timeout:1000});
                        if (!undScores.includes("_"))
                        {
                            y = 1;
                            let nice = await(message.channel.send('nice, you guessed the last letter'));
                            prog.edit(`${"``" + undScores + "``"} 🥳🏆`);
                            let congrat = await(message.channel.send('congrats, you won!'));
                            collected.delete({timeout:1000});
                            nice.delete({timeout:5000});
                            congrat.delete({timeout:7500});
                            return collector.stop();
                        }
                    } else if (guess.length == wordToGuess.length)
                    {
                        y = 2;
                        prog.edit("``" + guess.split('').join(" ") + "``");
                        let congrat = await(message.channel.send('woah, you just guessed the whole word'));
                        congrat.delete({timeout:10000});
                        collector.stop();
                    }
                } else
                {
                    let oop = await(message.channel.send(`oops, ${guess} is not correct, please try again (you have ${guesses(wordToGuess) - guessesTaken.length} guesses left)`));
                    oop.delete({timeout:1000});
                }
                collected.delete();
            } else collector.stop();
        });
        collector.on('end', () =>
        {
            switch(y)
            {
                case 0:
                    break;
                case 1:
                    break;
                default:
                    break;
            }
            UserJSON[message.author.id].inGame = false;
            return fs.writeFileSync('./DB/users.json', JSON.stringify(UserJSON, null, 2));
        });
    }
}