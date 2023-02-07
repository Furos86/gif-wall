import WebSocket, {WebSocketServer} from 'ws';
import {v1 as uuidv1} from 'uuid'
import Configuration from '../configuration.mjs';

export default class WebSocketServerService {
    aliveInterval;
    totalViewers;
    sessions;
    constructor(imageEntityService) {
        this.sessions = new Map();
        this.totalViewers = 0;
        this.imageEntityService = imageEntityService;
        this.wss = new WebSocketServer({port: 8080});
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

    authSession(sessionId) {
        const client = this.sessions.get(sessionId);
        client.isAuth = true;
        console.log(client.sessionId);
    }

    isAuth(sessionId) {
        if(Configuration.nodeEnv === 'development') return true;
        return this.sessions.has(sessionId);
    }

    _onServerConnection  = (ws) => {
        ws.sessionId = uuidv1();
        ws.isAuth = false;
        this.totalViewers++;
        this._updateViewerCount();
        ws.on('pong', function() {
            this.isAlive = true;
        })
        ws.on('close',() => {
            this.sessions.delete(ws.sessionId);
            this.totalViewers--;
            this._updateViewerCount();
        });
        ws.on('message', async (data) =>{

            let event = JSON.parse(data);
            switch(event.type) {
                case 'updateEntity':
                    if(!this._checkAuth(ws)) return;
                    await this.imageEntityService.Update(event.data);
                    this._sendEvent(event);
                    break;
                case 'deleteEntity':
                    if(!this._checkAuth(ws)) return;
                    await this.imageEntityService.Remove(event.data);
                    this._sendEvent(event);
                    break;
                case 'updateEntitiesDisplayOrder':
                    if(!this._checkAuth(ws)) return;
                    await this.imageEntityService.UpdateDisplayOrder(event.data);
                    this._sendEvent(event);
                    break;
                case 'init':
                    this.sessions.set(ws.sessionId, ws);
                    this._sendEvent({type:'init', data:{sessionId:ws.sessionId}});
            }
        })
    }

    _checkAuth(client) {
        if(Configuration.nodeEnv === 'development') return true;
        if(!client.isAuth) {
            this._sendEvent({
                type:'notAuth'
            })
            return false;
        }
        return true;
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
