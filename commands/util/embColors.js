module.exports = {
    name: 'embedColors', hide: true,
    execute() {
        global = {...global,
            orange: [Math.floor(Math.random() * 25) + 230,
                Math.floor(Math.random() * 40) + 100,
                Math.floor(Math.random() * 35)],
            blue: [Math.floor(Math.random() * 50),
                Math.floor(Math.random() * 100) + 50,
                Math.floor(Math.random() * 25) + 230],
            green: [Math.floor(Math.random() * 50),
                Math.floor(Math.random() * 54) + 200,
                Math.floor(Math.random() * 40) + 40],
            red: [Math.floor(Math.random() * 5) * 30 + 100,
                Math.floor(Math.random() * 50) + 20,
                Math.floor(Math.random() * 50) + 20]
        }
    }
}