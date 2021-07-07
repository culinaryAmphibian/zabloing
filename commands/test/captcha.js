const {createCanvas} = require('canvas');
const {captcha: {fonts, chars}} = require('../../DB/config.json');
const {badWords} = require('../../DB/secret.json');

function captchaGen()
{
    let captchaStr;

    captchaStr = '';
    for (let i = 0; i < ((Math.random() * 2) + 4); i++)
    {
        captchaStr += chars[Math.floor(Math.random() * chars.length)];
    }
    return captchaStr;
}

async function badWordCheck()
{
    let captchaStr = captchaGen();
    while (badWords.find(badWord => captchaStr.includes(badWord)))
    {
        captchaStr = captchaGen();
    }
    return captchaStr;
}

function fisheye(ctx, level, x, y, width, height)
{
    const frame = ctx.getImageData(x, y, width, height);
    const source = new Uint8Array(frame.data);

    for (let i = 0; i < frame.data.length; i += 4)
    {
        const sx = (i / 4) % frame.width;
        const sy = Math.floor(i / 4 / frame.width);

        const dx = Math.floor(frame.width / 2) - sx;
        const dy = Math.floor(frame.height / 2) - sy;

        const dist = Math.sqrt( (dx * dx) + (dy * dy) );

        const x2 = Math.round( (frame.width / 2) - (dx * Math.sin(dist / (level * Math.PI) / 2)));
        const y2 = Math.round( (frame.height / 2) - ( dy * Math.sin(dist / (level * Math.PI) / 2)));
        const i2 = ((y2 * frame.width) + x2) * 4;

        frame.data[i] = source[i2];
        frame.data[i + 1] = source[i2 + 1];
        frame.data[i + 2] = source[i2 + 2];
        frame.data[i + 3] = source[i2 + 3];
    }
    ctx.putImageData(frame, x, y);
    return ctx;
}

module.exports =
{
    name: 'captcha', hide: true,
    async execute(message)
    {
        let captcha = await badWordCheck();
        const canvas = createCanvas( 500, 250);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${Math.floor(Math.random() * 9) + 50}px ${fonts[Math.floor(Math.random() * fonts.length)]}`;
        ctx.fillStyle = '#0421f9';
        ctx.fillText(captcha, (Math.floor(Math.random() * canvas.width/6) + canvas.width/4), Math.floor(Math.random() * canvas.height/6) + canvas.height/2);
        await fisheye(ctx, 40, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), canvas.width, canvas.height);
        ctx.rotate((Math.floor(Math.random() * 50) - 15) * ( Math.PI/180));

        const attachment = canvas.toBuffer('image/png');
        message.channel.send('please send the text code in the image', {files:[attachment]});
        return captcha;
    }
}