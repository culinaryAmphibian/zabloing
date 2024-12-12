const dateFormat = import('dateformat');
const tracker = require('delivery-tracker');
const validator = require('tracking-number-validation');

let errEmbed = {color: global.orangeCol, title: 'error', description: 'no specified package to track!', footer: global.footer};
[]
module.exports =
{
    name: ['track'], dmOnly: true, description: 'tracks a package', usage: 'track <package tracking id>\nexample: track SEA1234567',
    note: 'this command only works in dms for privacy reasons, so don\'t use a prefix for this command\n\nthe [package tracking module i\'m using](https://www.npmjs.com/package/delivery-tracker) has support for more couriers than the [package tracking id validation module](https://www.npmjs.com/package/tracking-number-validation) that i\'m using lol',
    async execute(message)
    {
        let args = message.content.split(" ");
        if (!args[1]) return message.channel.send({embed:errEmbed});
        let code = args.slice(1).join(" ");
        let courierUno = validator.getCourier(code).pop();
        let courier = tracker.courier(courierUno);
        courier.trace(args[1], function(err, result)
        {
            errEmbed.description = err;
            if (err) return message.channel.send({embed:errEmbed});
            errEmbed.description = 'no result was fetched';
            if (!result) return message.channel.send({embed:errEmbed});
            let embed =
            {
                color: global.blueCol, title: `${result.courier.name} package ${code}`,
                description: `Status: ${result.status} (${result.checkpoints.length} checkpoints available to be displayed)`
            };
            if (result.checkpoints)
            {
                embed.fields = [];
                result.checkpoints.forEach(o => embed.fields.push({name: `${o.status}: ${o.message}`, value: `${o.location}\n${dateFormat(o.time, "UTC:dddd, mmmm dS, yyyy, h:MM TT")}`}));
            }
            try
            {
                return message.author.send({embed:embed});
            } catch(err) {return}
        })
    }
}