const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');

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
    }
  
  },
  {
    timestamps:false
  }
  )
  
  // Turno.sync({force:true})

  module.exports = Turno;