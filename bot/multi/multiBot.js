const { fork } = require('child_process')

const BOTS_PER_THREAD = 25
const THREADS = 10

for (var i = 1; i <= THREADS ; i++) {
    const forked = fork('./childBot.js')
    forked.send({
        address: `ws://localhost:8079`,
        count: BOTS_PER_THREAD,
        start: true
    })
}


process.on('SIGINT', function () {
    console.log("multiBot caught interrupt signal")
    process.exit()
})