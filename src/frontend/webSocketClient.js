export default class WebSocketClient {
    _updateCallbacks = [];
    webSocket
    constructor() {
        this.webSocket = new WebSocket('ws://localhost:8080');
        this.webSocket.onmessage = this._messageSwitch;
    }

    _messageSwitch = (message) => {
        const event = JSON.parse(message.data);
        switch(event.type) {
            case 'updateEntity':
                this._updateCallbacks.forEach((cb) => {
                    cb(event.data);
                })
            break;
            default:
                console.log(data);
        }
    }

    set onUpdateEntity(callback) {
        this._updateCallbacks.push(callback);
    }

    UpdateEntity(entityUpdateData) {
        this.webSocket.send(JSON.stringify({type:'updateEntity', data:entityUpdateData}));
    }
}
