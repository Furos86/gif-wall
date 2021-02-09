import Sequelize from 'sequelize';

export function ImageEntityFactory(sequelize) {
    return sequelize.define('imageEntity', {
        id:{
            type:Sequelize.DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        fileHash: {
            type:Sequelize.DataTypes.STRING,
        },
        x:{
            type:Sequelize.DataTypes.INTEGER,
            defaultValue:0
        },
        y:{
            type:Sequelize.DataTypes.INTEGER,
            defaultValue:0
        },
        z:{
            type:Sequelize.DataTypes.INTEGER,
            defaultValue:0
        },
        scale:{
            type:Sequelize.DataTypes.FLOAT,
            defaultValue:1
        }
    })
}
