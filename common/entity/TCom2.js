import nengi from 'nengi'

class TCom2 {
    constructor() {
        this.foo = 'bar'
    }
}

TCom2.protocol = {
    foo: nengi.String
}

export default TCom2
