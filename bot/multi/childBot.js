
const glue = require('./glue')
const nengi = glue.nengi.default
const nengiConfig = glue.nengiConfig.default
const MoveCommand = glue.MoveCommand.default


var protocolMap = new nengi.ProtocolMap(nengiConfig, nengi.metaConfig)

//var address = 'ws://localhost:8001'
var address = null //'wss://us-west-3.zombieswithguns.io/6'

var numberOfBots = 10
var bots = new Map()

process.on('message', msg => {
    if (msg.address) {
        address = msg.address
    }
    if (msg.count) {
        numberOfBots = msg.count
    }

    if (msg.start) {
        for (let i = 0; i < numberOfBots; i++) {
            setTimeout(() => {
                connectNewBot(i)
            }, i * 250)
        }
    }

    if (msg.stop) {
        bots.forEach(bot => {
            if (bot.websocket) {
                bot.websocket.terminate()
            }
        })
    }
})

process.on('SIGINT', function () {
    console.log('childBot caught interrupt signal, cleaning up websocket')
    bots.forEach(bot => {
        if (bot.websocket) {
            bot.websocket.terminate()
        }
    })
    process.exit()
})


var bots = new Map()
function connectNewBot(id) {
    let bot = new nengi.Bot(nengiConfig, protocolMap)
    bot.id = id

    bot.controls = {
        w: false,
        a: false,
        s: false,
        d: false,
        rotation: 0,
        delta: 1 / 60
    }

    bot.onConnect(response => {
        console.log('Bot attempted connection, response:', response)
        bot.tick = 0
    })

    bot.onClose(() => {
        bots.delete(bot.id)
    })

    bots.set(bot.id, bot)
    bot.connect(address, {})
}

function randomBool() {
    return Math.random() > 0.5
}

var loop = function () {
    bots.forEach(function botLoop(bot) {
        if (bot.websocket) {
            bot.readNetwork()
            // small percent chance of changing which keys are being held down
            // this causes the bots to travel in straight lines, for the most part
            if (Math.random() > 0.95) {
                bot.controls = {
                    w: randomBool(),
                    a: randomBool(),
                    s: randomBool(),
                    d: randomBool(),
                    rotation: Math.random() * Math.PI * 2,
                    delta: 1 / 60
                }
            }

            var input = new MoveCommand(
                bot.controls.w,
                bot.controls.a,
                bot.controls.s,
                bot.controls.d,
                bot.controls.rotation,
                bot.controls.delta
            )

            if (Math.random() > 0.7) {
                // bot.addCommand(new FireCommand(500, 500, Math.random()))
            }

            bot.addCommand(input)
            bot.update()
            bot.tick++
        }
    })
}

// starts a ~60 fps loop after 100 ms
setTimeout(() => {
    setInterval(loop, 16)
}, 100)




