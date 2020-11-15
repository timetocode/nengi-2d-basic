import nengi from 'nengi'

class TextMessage {
    constructor(text) {
        this.text = text
    }
}

TextMessage.protocol = {
    text: nengi.String
}

export default TextMessage
