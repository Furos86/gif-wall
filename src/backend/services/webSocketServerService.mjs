import WebSocket from 'ws';

export default class WebSocketServerService {
    aliveInterval;
    totalViewers;
    constructor(imageEntityService) {
        this.totalViewers = 0;
        this.imageEntityService = imageEntityService;
        this.wss = new WebSocket.Server({port: 8080});
        this.wss.on('connection', this._onServerConnection);
        this.aliveInterval = setInterval(this._aliveCheck, 30000)
    }

    _aliveCheck = () => {
        this.wss.clients.forEach(ws => {
            if (ws.isAlive === false){
                ws.terminate();
                return;
            }
            ws.isAlive = false;
            ws.ping(function () {});
        })
    }

    _updateViewerCount = () =>{
        this._sendEvent({type:'viewerCountUpdate',data:this.totalViewers});
    }

    _onServerConnection  = (ws) => {
        this.totalViewers++;
        this._updateViewerCount();
        ws.on('pong', function() {
            this.isAlive = true;
        })
        ws.on('close',() => {
            this.totalViewers--;
            this._updateViewerCount();
        });
        ws.on('message', async (data) =>{
            let event = JSON.parse(data);
            switch(event.type) {
                case 'updateEntity':
                    await this.imageEntityService.Update(event.data);
                    this._sendEvent(event);
                    break;
                case 'deleteEntity':
                    await this.imageEntityService.Remove(event.data);
                    this._sendEvent(event);
                    break;
                case 'updateEntitiesDisplayOrder':
                    await this.imageEntityService.UpdateDisplayOrder(event.data);
                    this._sendEvent(event);
                    break;
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
