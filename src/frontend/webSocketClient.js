export default class WebSocketClient {
    _updateCallbacks = [];
    _callbacks = new Map();
    webSocket
    constructor() {
        this.webSocket = new WebSocket('ws://localhost:8080');
        this.webSocket.onmessage = this._messageSwitch;
    }

    _messageSwitch = (message) => {
        const event = JSON.parse(message.data);
        if(!this._callbacks.has(event.type)) return null;
        this._callbacks.get(event.type).forEach(cb => cb(event.data))
    }

    on(eventType, callback) {
        if(!this._callbacks.has(eventType)) this._callbacks.set(eventType, []);
        this._callbacks.get(eventType).push(callback);
    }

    UpdateEntity(entityUpdateData) {
        this.webSocket.send(JSON.stringify({type:'updateEntity', data:entityUpdateData}));
    }
}
