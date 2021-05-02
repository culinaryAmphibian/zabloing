function arg(args)
{
    if (!isNaN(args[2]))
    {
        if ( (args[3]) && (!isNaN(args[3])) )
        {
            return 2;
        }
        return 1;
    } else return 0;
}

module.exports =
{
    name: 'calc', description: 'calculator',
    execute(message, args)
    {
        if (!args[2]) return;
        args[2] = parseInt(args[2]);
        let factor = Math.PI/180;
        if (args[3] == 'rad')
        {
            factor = 1;
        } else args[3] = parseInt(args[3]);
        switch(args[1])
        {
            case 'add':
                switch(arg(args))
                {
                    case 1:
                        message.channel.send(args[2] * 2);
                        break;
                    case 2:
                        message.channel.send(args[2] + args[3]);
                        break;
                }
                break;
            case 'subtract':
                if (arg(args) == 2)
                {
                    message.channel.send(args[2] - args[3]);
                }
                break;
            case 'mult':
                switch(arg(args))
                {
                    case 1:
                        message.channel.send(args[2] * 2);
                        break;
                    case 2:
                        message.channel.send(args[2] * args[3]);
                        break;
                }
                break;
            case 'div':
                if (arg(args) == 2)
                {
                    if (args[3] == 0) return;
                    message.channel.send(args[2] / args[3]);
                }
                break;
            case 'sqrt':
                if (args[2] < 0) return;
                message.channel.send(Math.sqrt(args[2]));
                break;
            case '!':
                if (args[2] > 100) return message.channel.send('pls no i don\'t want my computer to die thanks');
                let i;
                let result = 1;
                for (i = 1; i <= args[2]; i++)
                {
                    result *= i;
                }
                message.channel.send(result);
                break;
            case 'exp':
                if (args[3] > 13 || args[2] > 13) return;
                switch(arg(args))
                {
                    case 1:
                        message.channel.send(`${args[2]} to the ${args[2]} power = ${Math.pow(args[2], args[2])}`);
                        break;
                    case 2:
                        message.channel.send(Math.pow(args[2], args[3]));
                        break;
                }
                break;
            case 'rem':
                if (!args[3]) return;
                message.channel.send(`${args[2] % args[3]}`);
                break;
            case 'sin':
                message.channel.send(Math.sin(args[2] * factor));
                break;
            case 'cos':
                message.channel.send(Math.cos(args[2] * factor));
                break;
            case 'tan':
                message.channel.send(Math.tan(args[2] * factor));
                break;
            // case 'asin':
            //     message.channel.send(Math.sin((1/args[2]) * factor));
            //     break
            // case 'acos':
            //     message.channel.send(Math.acos(args[2] * factor));
            //     break
            // case 'atan':
            //     message.channel.send(Math.atan(args[2] * factor));
            //     break;
        }
    }
}