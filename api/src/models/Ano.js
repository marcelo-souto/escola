const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');
const Diretor = require('./Diretor.js')

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
);
  
  // Ano.sync({force:true})
  
Ano.belongsTo(Diretor, { foreignKey: "diretorId" });
Ano.hasOne(Diretor, { foreignKey: "diretorId" });
Diretor.hasMany(Ano, { foreignKey: "diretorId" });

  module.exports = Ano;