const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');

const Ano = sequelize.define(
  'anos',
  {
      anoId:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      
      anoLetivo:{
        type: DataTypes.STRING,
        allowNull: false,
      }
  },
  {
    timestamps:false
  }
);
  
  // Ano.sync({force:true})
  
  module.exports = Ano;