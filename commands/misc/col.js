const {color: {defaults}} = require('../../DB/config.json');
const reason = 'official color role stuff business';

let errEmbed = {color: global.orangeCol, title: 'error', description: 'i don\'t have the perms to manage roles', footer: global.footer};

const template = (color, position) => {return {name: `#${color}`, color: color, position: position, permissions: [], mentionable: false}};
const hexMatching = (str) => {
    let match = str.match(/^#?([a-f0-9]{6})$/i);
    if (match) return match[1];
    return;
} 

let n = Object.keys(defaults).length + 1;

module.exports = {
    name: ['color', 'colour', 'col'], description: 'assigns a color role', usage: '[pref]col <color hex code or basic color name>\nexample: [pref]colour 06d4e2',
    note: `there are ${n} different named colors available.\nyou can see them all at [w3schools](https://www.w3schools.com/cssref/css_colors.asp) and the (discord.js docs)[https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable].`,
    async execute(message, args) {
        if (!message.guild.me.hasPermission('MANAGE_ROLES'))
            return message.channel.send({embed:errEmbed});
        errEmbed.description = 'please specify a valid color hex or name';
        if (!args[1]) return message.channel.send({embed:errEmbed});
        let col;
        let hexMatch = args[1].match(/^#?([a-f0-9]{6})$/i);
        if (defaults[args[1]])
            col = defaults[args[1]].toLowerCase();
        else if (hexMatch)
            col = hexMatch[1];
        else if (args[1].toLowerCase() == 'random')
            col = 'RANDOM';
        else
            return message.channel.send({embed:errEmbed});
        let guildMember = message.member;
        let pos = 1;
        if (guildMember.roles.color) pos = guildMember.roles.color.position + 1;
        let roleToGive;

        let membersearchFrom = guildMember.roles.cache?.filter(r => hexMatching(r.name) == r.color.toString(16));
        let memberAlreadyHasRole = membersearchFrom?.find(r => r.name.slice(1) == col);
        errEmbed.description = 'you already have that role!';
        if (memberAlreadyHasRole)
            return message.channel.send({embed:errEmbed});
        if (membersearchFrom)
            guildMember.roles.remove(membersearchFrom, reason);

        let guildSearchFrom = message.guild.roles.cache.filter(r =>
            hexMatching(r.name) == r.color.toString(16)).find(r => r.name.slice(1) == col);

        guildSearchFrom ? roleToGive = guildSearchFrom : roleToGive = await(message.guild.roles.create({data:template(col, pos),reason:reason}));

        if (col == 'RANDOM')
            roleToGive.edit({name: `#${roleToGive.color.toString(16)}`});
        guildMember.roles.add(roleToGive, reason).then(() => message.channel.send('done!'));

        if (!guildMember.roles.color) return;
        if (roleToGive.position < guildMember.roles.color.position) {
            errEmbed.description = 'sorry, but the role hierarchy doesn\'t let me move the requested color role higher than your current color role.';
            if (message.guild.me.roles.highest.position < guildMember.roles.color.position)
                return message.channel.send({embed:errEmbed});
            return roleToGive.edit({position:guildMember.roles.color.position + 1});
        }
    }
}