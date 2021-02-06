import Sequelize from 'sequelize';
const {DataTypes} = Sequelize;

export function ImageEntityFactory(sequelize) {
    return sequelize.define('imageEntity', {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        fileHash: {
            type:DataTypes.STRING,
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
        },
        scale:{
            type:DataTypes.FLOAT,
            defaultValue:1
        }
    })
}
