import {Sequelize} from 'sequelize';
import mysql from 'mysql2'
import Configuration from '../configuration'
import {GifEntityFactory} from '../models/gifEntity';
import {sleep} from '../utils/sleep';

export default class DatabaseService {
    sequelize
    models = {
        GifEntity:null
    }

    async start() {
        await this.waitForConnection();

        this.sequelize = await new Sequelize({
            host: Configuration.databaseHost,
            dialect: 'mysql',
            password: Configuration.databasePassword,
            username: Configuration.databaseUser,
            database: Configuration.database
        })

        this.models.GifEntity = GifEntityFactory(this.sequelize);

        this.sequelize.sync();
    }

    async waitForConnection() {
        let isConnected = false;

        const db = mysql.createConnection({
            host: Configuration.host,
            port: 3306,
            password: Configuration.databasePassword,
            user: Configuration.databaseUser
        })

        db.connect((error) => {
            if(!error) isConnected = true;
        })

        while(!isConnected) {
            console.log(`connecting to database`);
            await sleep(500);
        }

        if(!Configuration.makeDatabase) return;
        db.query(`CREATE DATABASE IF NOT EXISTS \`${Configuration.database}\`;`, (error) => {
            if(error) throw error;
        });

    }
}
