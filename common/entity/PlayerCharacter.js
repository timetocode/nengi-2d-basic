import nengi from 'nengi'
import WeaponSystem from '../WeaponSystem'
import SAT from 'sat'

class PlayerCharacter {
    constructor() {
        this.x = 0
        this.y = 0
        this.rotation = 0
        this.hitpoints = 100
        this.isAlive = true


        this.moveDirection = {
            x: 0,
            y: 0
        }

        this.speed = 400

        this.weaponSystem = new WeaponSystem()

        this.collider = new SAT.Circle(new SAT.Vector(this.x, this.y), 25)
    }


    takeDamage(amount) {
        if (this.isAlive) {
            this.hitpoints -= amount
        }

        if (this.hitpoints <= 0 && this.isAlive) {
            this.hitpoints = 0
            this.isAlive = false

            // DEAD! come back to life and teleport to a new spot
            setTimeout(() => {
                this.hitpoints = 100
                this.isAlive = 100
                this.x = Math.random() * 500
                this.y = Math.random() * 500
            }, 1000)
        }
    }

    fire() {
        if (!this.isAlive) {
            return false
        }

        return this.weaponSystem.fire()
    }

    processMove(command) {
        if (!this.isAlive) {
            return
        }

        this.rotation = command.rotation

        let unitX = 0
        let unitY = 0

        // create forces from input
        if (command.forward) { unitY -= 1 }
        if (command.backward) { unitY += 1 }
        if (command.left) { unitX -= 1 }
        if (command.right) { unitX += 1 }

        // normalize      
        const len = Math.sqrt(unitX * unitX + unitY * unitY)
        if (len > 0) {
            unitX = unitX / len
            unitY = unitY / len
        }

        this.moveDirection.x = unitX
        this.moveDirection.y = unitY


    }

    move(delta) {
        this.x += this.moveDirection.x * this.speed * delta
        this.y += this.moveDirection.y * this.speed * delta

        this.collider.pos.x = this.x
        this.collider.pos.y = this.y
    }
}

PlayerCharacter.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    rotation: { type: nengi.RotationFloat32, interp: true },
    isAlive: nengi.Boolean,
    hitpoints: nengi.UInt8
}

export default PlayerCharacter
