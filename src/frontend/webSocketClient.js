export default class WebSocketClient {
    _updateCallbacks = [];
    _callbacks = new Map();
    _awaitInit = true;
    sessionId;
    webSocket;
    constructor() {
        let loc = window.location, new_uri;
        if (loc.protocol === "https:") {
            new_uri = "wss:";
        } else {
            new_uri = "ws:";
        }
        new_uri += "//" + loc.hostname;
        this.webSocket = new WebSocket(`${new_uri}:8080`);
        this.webSocket.onmessage = this._messageSwitch;
        this.webSocket.onopen = () => {
            this.webSocket.send(JSON.stringify({type:'init'}));
        }
    }

    _messageSwitch = (message) => {
        const event = JSON.parse(message.data);
        if(this._awaitInit && event.type === 'init') {
            this.sessionId = event.data.sessionId;
            this._awaitInit = false;
        }
        if(!this._callbacks.has(event.type)) return null;
        this._callbacks.get(event.type).forEach(cb => cb(event.data))
    }

    on(eventType, callback) {
        if(!this._callbacks.has(eventType)) this._callbacks.set(eventType, []);
        this._callbacks.get(eventType).push(callback);
    }

    updateEntityDisplayOrder(data) {
        this.webSocket.send(JSON.stringify({type:'updateEntitiesDisplayOrder', data: data}))
    }

    UpdateEntity(entityUpdateData) {
        this.webSocket.send(JSON.stringify({type:'updateEntity', data:entityUpdateData}));
    }

    DeleteEntity(id) {
        this.webSocket.send(JSON.stringify({type:'deleteEntity',data:id}));
    }
}
