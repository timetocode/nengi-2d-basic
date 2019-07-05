import nengi from 'nengi'

class TCom {
    constructor() {
        this.hello = 'world'
    }
}

TCom.protocol = {
    hello: nengi.String
}

export default TCom
