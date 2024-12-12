const fs = require('fs');
const ServerJSON = require('../../DB/servers.json');

function hsl2rgb(h, s = 100, l = 50)
{
    h = parseFloat(h) ?? 0;
	s = parseFloat(s) ?? 0;
	l = parseFloat(l) ?? 0;
	if (h < 0) h = 0;
	if (s < 0) s = 0;
	if (l < 0) l = 0;
	if (h >= 360) h = 359;
	if (s > 100) s = 100;
	if (l > 100) l = 100;
	s /= 100;
	l /= 100;
	let C = (1 - Math.abs(2 * l - 1)) * s;
	let hh = h/60;
	let X = C * (1 - Math.abs(hh % 2 - 1));
	let r = g = b = 0;
	if (hh >= 0 && hh < 1)
	{
		r = C;
		g = X;
	}
	else if (hh >= 1 && hh < 2)
	{
		r = X;
		g = C;
	}
	else if (hh >= 2 && hh < 3)
	{
		g = C;
		b = X;
	}
	else if (hh >= 3 && hh < 4)
	{
		g = X;
		b = C;
	}
	else if (hh >= 4 && hh < 5)
	{
		r = X;
		b = C;
	}
	else
	{
		r = C;
		b = X;
	}
	let m = l - C / 2;
	r += m;
	g += m;
	b += m;
	r *= 255.0;
	g *= 255.0;
	b *= 255.0;
	r = Math.round(r);
	g = Math.round(g);
	b = Math.round(b);
	let hex = r * 65536 + g * 256 + b;
	hex = hex.toString(16, 6);
	while (hex.length < 6)
    {
        hex = '0' + hex;
    }
    return {rgb: [r, g, b], hex: `#${hex}`};
}

module.exports = {
    name: 'rainbow', hide: true,
    execute(guildId) {
		let lastCol = ServerJSON[guildId].lastEmbedHue;
		if ((!'lastEmbedHue' in ServerJSON[guildId]) || (lastCol > 359)) lastCol = -30;
		lastCol += 30;
		ServerJSON[guildId].lastEmbedHue = lastCol;
		fs.writeFileSync('./DB/servers.json', JSON.stringify(ServerJSON, null, 2));
        return hsl2rgb(lastCol).hex;
    }
}