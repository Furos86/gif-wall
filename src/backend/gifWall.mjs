import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import DatabaseService from './services/databaseService.mjs';
import ImageEntitiesService from './services/imageEntitiesService.mjs';
import Routes from './routes/routes.mjs';
import FileStoreService from './services/fileStoreService.mjs';
import WebSocketServerService from './services/webSocketServerService.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class gifWall {
    constructor() {
       this.app = express();
    }

    async Start(port) {
        const fileStoreService = new FileStoreService();
        const databaseService = new DatabaseService();
        const imageEntityService = new ImageEntitiesService(databaseService, fileStoreService);
        const webSocketServerService = new WebSocketServerService(imageEntityService);

        try{
            await databaseService.start();
        } catch (error) {
            console.log(error);
        }
        await imageEntityService.start();
        this.app.listen(port);
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: '1mb'}));
        this.app.use('/', express.static(path.join(__dirname, 'static')));

        this.app.use(new Routes(imageEntityService, webSocketServerService, fileStoreService).router)
    }
}
