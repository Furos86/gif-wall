import Sequelize from 'sequelize';

export function DisplayOrderFactory(sequelize) {
    return sequelize.define('displayOrder',{
        key:{
            type:Sequelize.DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        state:{
            type:Sequelize.DataTypes.JSON
        }
    })
}
