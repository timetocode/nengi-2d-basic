import nengi from 'nengi';
import SAT from 'sat';

class GreenCircle {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.hitpoints = 100
        this.isAlive = true
        this.collider = new SAT.Circle(new SAT.Vector(this.x, this.y), 25)
    }

    takeDamage(amount) {
        if (this.isAlive) {
            this.hitpoints -= amount
        }

        if (this.hitpoints <= 0 && this.isAlive) {
            this.hitpoints = 0
            this.isAlive = false
        }
    }
}

GreenCircle.protocol = {
    x: { type: nengi.Float32, interp: false },
    y: { type: nengi.Float32, interp: false },
    hitpoints: nengi.UInt8
}

export default GreenCircle;
