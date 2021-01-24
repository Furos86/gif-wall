import {Sequelize} from 'sequelize';
import mysql from 'mysql2'
import Configuration from '../configuration'
import {GifEntityFactory} from '../models/gifEntity';
import {sleep} from '../utils/sleep';

/*const sequelize = new Sequelize({
    host:Configuration.databaseHost,
    dialect:'mysql',
    password: Configuration.databasePassword,
    username: Configuration.databaseUser,
    database:Configuration.database
})

const GifEntity = GifEntityFactory(sequelize);

const createDatabase = async() => {
    if(!Configuration.makeDatabase) return;
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: Configuration.host,
            port: 3306,
            password: Configuration.databasePassword,
            user: Configuration.databaseUser
        })
        connection.connect((error) =>{
            if(error) reject(error);
            connection.query(`CREATE DATABASE IF NOT EXISTS \`${Configuration.database}\`;`, (error, result) =>{
                if(error) reject(error);
                if(result) resolve();
            });
        });
    })
}

export const db = {
    sequelize:sequelize,
    createDatabase:createDatabase,
    GifEntity:GifEntity
}*/

export default class DatabaseService {
    sequelize
    models = {
        GifEntity:null
    }

    async start() {
        await this.waitForConnection();
        await this.createDatabase();
        this.models.GifEntity = GifEntityFactory(this.sequelize);

        this.sequelize.sync();
    }

    async createDatabase () {
        if (!Configuration.makeDatabase) return;
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection({
                host: Configuration.host,
                port: 3306,
                password: Configuration.databasePassword,
                user: Configuration.databaseUser
            })
            connection.connect((error) => {
                if (error) reject(error);
                connection.query(`CREATE DATABASE IF NOT EXISTS \`${Configuration.database}\`;`, (error, result) => {
                    if (error) reject(error);
                    if (result) resolve();
                });
            });
        })
    }

    async waitForConnection() {
        this.sequelize = await new Sequelize({
            host: Configuration.databaseHost,
            dialect: 'mysql',
            password: Configuration.databasePassword,
            username: Configuration.databaseUser,
            database: Configuration.database
        })
        let isConnected = false;
        while(!isConnected) {
            try {
                await this.sequelize.authenticate();
                isConnected = true;
            } catch (error) {
                console.log(`database server not responding`)
                await sleep(500)
            }
        }
    }
}
