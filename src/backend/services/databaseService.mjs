import {Sequelize} from 'sequelize';
import mysql from 'mysql2'
import Configuration from '../configuration.mjs'
import {ImageEntityFactory} from '../models/imageEntity.mjs';
import {sleep} from '../utils/sleep.mjs';

export default class DatabaseService {
    models = {
        ImageEntity:null
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

        this.models.ImageEntity = ImageEntityFactory(this.sequelize);

        this.sequelize.sync();
    }



    async waitForConnection() {
        let isConnected = false;

        let db;

        while(!isConnected) {
            db = mysql.createConnection({
                host: Configuration.databaseHost,
                port: 3306,
                password: Configuration.databasePassword,
                user: Configuration.databaseUser
            })
            db.connect((error) => {
                if(!error) {
                    isConnected = true;
                } else {
                    db.close()
                }
            })
            console.log(`connecting to database`);
            await sleep(500);
        }

        if(!Configuration.makeDatabase) return;
        db.query(`CREATE DATABASE IF NOT EXISTS \`${Configuration.database}\`;`, (error) => {
            if(error) throw error;
        });

    }
}
