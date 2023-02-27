const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');
const Diretor = require('./Diretor')

const Turno = sequelize.define(
  'turnos',
  {

    turnoId:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  
    periodo:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    diretorId: {
      type: DataTypes.INTEGER,
      references: {
        model: Diretor,
        key: "diretorId",
        allowNull: false,
      },
    }
  
  },
  {
    timestamps:false
  }
  )
  
  // Turno.sync({force:true})

Turno.belongsTo(Diretor, { foreignKey: "diretorId" });
Diretor.hasMany(Turno, { foreignKey: "diretorId" });

module.exports = Turno;