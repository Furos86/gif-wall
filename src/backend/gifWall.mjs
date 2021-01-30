import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import WebSocket from 'ws';
import DatabaseService from './services/databaseService.mjs';
import ImageEntitiesService from './services/imageEntitiesService.mjs';
import Routes from './routes/routes.mjs';
import FileStoreService from './services/fileStoreService.mjs';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class gifWall {
    constructor() {
       this.app = express();
    }

    async Start(port) {
        const fileStoreService = new FileStoreService();
        const databaseService = new DatabaseService();
        const gifEntityService = new ImageEntitiesService(databaseService, fileStoreService);

        try{
            await databaseService.start();
        } catch (error) {
            console.log(error);
        }

        this.app.listen(port);
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: '1mb'}));
        this.app.use('/', express.static(path.join(__dirname, 'static')));

        this.app.use(new Routes(gifEntityService, fileStoreService).router)

        let wss = new WebSocket.Server({port: 8080});
        wss.on('connection', (ws) => {
            ws.on('message', (message) =>{
                console.log(message);
            })
            ws.send('hallo')
        })
    }
}
