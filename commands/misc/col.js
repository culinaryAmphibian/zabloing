const config = require('../../DB/config.json');
const defaults = config.color.defaults;
const reason = 'official color role stuff business';

let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
let o_b = (Math.floor(Math.random() * 35) + 1)
let orangeCol = [o_r,o_g,o_b];

let errEmbed = {color: orangeCol, title: 'error', description: 'i don\'t have the perms to manage roles', footer: global.footer};

function template(color, position)
{
    let obj =
    {
        name: `#${color}`,
        color: color,
        position: position,
        permissions: [],
        mentionable: false
    };
    return obj;
}

let a = Object.keys(config.color.defaults);
let n = a.length;

module.exports =
{
    name: ['color', 'colour'], description: 'assigns a color role', usage: '[pref]color/colour <color hex code or basic color name>\nexample: [pref]color 06d4e2',
    note: `there are ${n} named colors available, they are the default css colors; you can see them all at [w3schools](https://www.w3schools.com/cssref/css_colors.asp ":D").`,
    async execute(message, args)
    {
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send({embed:errEmbed});
        errEmbed.description = 'please specify a valid hex or color name'
        if (!args[1]) return message.channel.send({embed:errEmbed});
        let col;
        errEmbed.description = 'please specify a valid color name or hex';
        if (defaults[args[1]]) col = defaults[args[1]].toLowerCase();
        else if (args[1].match(/^#?([A-Fa-f0-9]{6})$/gi))
        {
            if (args[1].startsWith('#')) col = args[1].slice(1);
            else col = args[1];
        } else return message.channel.send({embed:errEmbed});
        let guildMember = message.member;
        let pos = 1;
        if (guildMember.roles.color) pos = guildMember.roles.color.position + 1;
        let roleToGive;

        let membersearchFrom = guildMember.roles.cache.filter(r => r.name.match(/^#([a-f0-9]{6})$/g));
        let memberAlreadyHasRole = membersearchFrom.find(r => (r.color == parseInt(r.name.slice(1), 16)) && (r.name.slice(1) == col));
        errEmbed.description = 'you already have that role!';
        if (memberAlreadyHasRole) return message.channel.send({embed:errEmbed});

        let memberhasOtherRole = membersearchFrom.find(r => parseInt(r.name.slice(1), 16) == r.color);
        if (memberhasOtherRole) guildMember.roles.remove(memberhasOtherRole, reason);

        let guildSearchFrom = message.guild.roles.cache.filter(r => r.name.match(/^#([a-f0-9]{6})$/g));
        let guildAlreadyHasRole = guildSearchFrom.find(r => (r.name.slice(1) == col) && (parseInt(r.name.slice(1), 16) == r.color));

        guildAlreadyHasRole ? roleToGive = guildAlreadyHasRole : roleToGive = await(message.guild.roles.create({data:template(col, pos),reason:reason}));

        guildMember.roles.add(roleToGive, reason).then(() => message.channel.send('done!'));

        if (!guildMember.roles.color) return;
        if (roleToGive.position < guildMember.roles.color.position)
        {
            errEmbed.description = 'sorry, but the role hierarchy doesn\'t let me move the requested color role higher than your current color role.';
            if (message.guild.me.roles.highest.position < guildMember.roles.color.position)
            return message.channel.send({embed:errEmbed});
            else return roleToGive.edit({position:guildMember.roles.color.position + 1});
        }
    }
}