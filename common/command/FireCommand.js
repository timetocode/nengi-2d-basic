import nengi from 'nengi'

class FireCommand {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

FireCommand.protocol = {
    x: nengi.Int32,
    y: nengi.Int32
}

export default FireCommand
