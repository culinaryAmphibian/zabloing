let r = Math.floor(Math.random() * 50);
let g = Math.floor(Math.random() * 100) + 50;
let b = (Math.floor(Math.random() * 25) + 1) + 230;
let blueCol = [r,g,b];

module.exports =
{
    name: 'calc', description: 'list of calculator functions', hide: true,
    execute(message, prefix, args)
    {
        if (!args[2])
        {
            let calcHelpEmbed =
            {
                color: blueCol, title: `a list of calculator commands`, fields: [
                    { name: `all the basic operations`, value: `addition (add), subtraction (subtract), multiplication (mult), division (div)`},
                    { name: `slightly more advanced operations`, value: `squareroot (sqrt), factorials (!), exponents (exp)`},
                    { name: `trigonometric functions`, value: `sin, cos, tan, asin, acos, atan`},
                    { name: `for syntax help:`, value: `do ${prefix}help calc < operator >`}], footer: global.footer
            };
            return message.channel.send({embed:calcHelpEmbed});
        }
        switch (args[2])
        {
            case 'add':
                break;
            case 'subtract':
                break;
            case 'mult':
                break;
            case 'div':
                break;
            case 'sqrt':
                break;
            case 'exp':
                break;
            case '!':
                break;
            case 'sin':
                break;
            case 'cos':
                break;
            case 'tan':
                break;
            case 'asin':
                break;
            case 'acos':
                break;
            case 'atan':
                break;
        }
    }
}