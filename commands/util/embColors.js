module.exports =
{
    name: 'embedColors', hide: true,
    execute(global)
    {
        let o_r = (Math.floor(Math.random() * 25) + 1) + 230;
        let o_g = 100 + (Math.floor(Math.random() * 40) + 1);
        let o_b = (Math.floor(Math.random() * 35) + 1)
        global.orangeCol = [o_r,o_g,o_b];

        let b_r = Math.floor(Math.random() * 50);
        let b_g = Math.floor(Math.random() * 100) + 50;
        let b_b = (Math.floor(Math.random() * 25) + 1) + 230;
        global.blueCol = [b_r,b_g,b_b];

        let g_r = ((Math.floor(Math.random() * 50)) + 1);
        let g_g = (((Math.floor(Math.random() * 54)) + 1)) + 200;
        let g_b = ((Math.floor(Math.random() * 40)) + 40);
        global.greenCol = [g_r,g_g,g_b];

        let r_r = (Math.floor(Math.random() * 5) * 30) + 100;
        let r_g = Math.floor(Math.random() * 50) + 20;
        let r_b = Math.floor(Math.random() * 50) + 20;
        global.redCol = [r_r,r_g,r_b];

        return global;
    }
}