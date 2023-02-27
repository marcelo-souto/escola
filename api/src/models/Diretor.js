const sequelize = require("../database/database.js");
const { DataTypes } = require("sequelize");

const Diretor = sequelize.define(
  "diretores",
  {
    diretorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    dataNascimento: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailVerificado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    senha:{
        type: DataTypes.STRING,
        allowNull: false,
    }
  },
  { timestamps: false }
);

// Diretor.sync({ force: true });

module.exports = Diretor;
