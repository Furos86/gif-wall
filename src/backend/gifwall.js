import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import * as path from 'path';
import WebSocket from 'ws'
import DatabaseService from './services/databaseService'
import GifEntitiesService from './services/gifEntitiesService';
import Routes from './routes/routes';
import FileStoreService from './services/fileStoreService';

export default class gifWall {
    app
    constructor() {
       this.app = express();
    }

    async Start(port) {
        const fileStoreService = new FileStoreService();
        const databaseService = new DatabaseService();
        const gifEntityService = new GifEntitiesService(databaseService, fileStoreService);

        try{
            await databaseService.start();
        } catch (error) {
            console.log(error);
        }

        this.app.listen(port);
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: '1mb'}));
        this.app.use('/', express.static(path.join(__dirname, 'static')));

        this.app.use(new Routes(gifEntityService).router)

        let wss = new WebSocket.Server({port: 8080});
        wss.on('connection', (ws) => {
            ws.on('message', (message) =>{
                console.log(message);
            })
            ws.send('hallo')
        })
    }
}
