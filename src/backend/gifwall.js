import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import * as path from 'path';
import WebSocket from 'ws';
import {db} from './models';

export default class gifWall {
    app
    constructor() {
       this.app = express();
    }

    async Start(port) {
        const sequelize = db.sequelize;
        try {
            await db.createDatabase();
            await sequelize.authenticate();
            await sequelize.sync();
        } catch(error) {
            throw error;
        }
        this.app.listen(port);
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: '1mb'}));
        this.app.use('/', express.static(path.join(__dirname, 'static')));
        let wss = new WebSocket.Server({port: 8080});
        wss.on('connection', (ws) => {
            ws.on('message', (message) =>{
                console.log(message);
            })
            ws.send('hallo')
        })
    }
}
