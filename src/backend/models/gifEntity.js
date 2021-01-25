import {DataTypes} from 'sequelize';

export function GifEntityFactory(sequelize) {
    return sequelize.define('gifEntity', {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        hash: {
            type:DataTypes.STRING,
            unique:true
        },
        x:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        y:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        z:{
            type:DataTypes.INTEGER,
            defaultValue:0
        }
    })
}
