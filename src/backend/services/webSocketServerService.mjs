import WebSocket from 'ws';

export default class WebSocketServerService {
    constructor(imageEntityService) {
        this.imageEntityService = imageEntityService;
        this.wss = new WebSocket.Server({port: 8080});
        this.wss.on('connection', this._onServerConnection);
    }

    _onServerConnection  = (ws) => {
        ws.on('message', async (data) =>{
            let event = JSON.parse(data);
            switch(event.type) {
                case 'updateEntity':
                    await this.imageEntityService.Update(event.data);
                    this._sendEvent(event)
            }
        })
    }

    EmitEntityCreate(entityData) {
        this._sendEvent({type:'createEntity',data:entityData})
    }

    _sendEvent(event) {
        const eventString = JSON.stringify(event);
        this.wss.clients.forEach( (client) => {
            if(client.readyState !== WebSocket.OPEN) return null;
            client.send(eventString);
        })
    }
}
