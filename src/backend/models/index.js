import {Sequelize} from 'sequelize';
import mysql from 'mysql2'
import Configuration from '../configuration'
import {GifEntityFactory} from './gifEntity';

const sequelize = new Sequelize({
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
}
