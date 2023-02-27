const sequelize = require("../database/database.js");
const { DataTypes } = require("sequelize");
const Turno = require("./Turnos");
const Ano = require("./Ano");
const Diretor = require('./Diretor')

const Turma = sequelize.define(
  "turmas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    turnoId: {
      type: DataTypes.INTEGER,
      references: {
        model: Turno,
        key: "turnoId",
        allowNull: false,
      },
    },

    anoId: {
      type: DataTypes.INTEGER,
      references: {
        model: Ano,
        key: "anoId",
        allowNull: false,
      },
    },
    numeroFinal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    codigo: {
      type: DataTypes.INTEGER,
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
    timestamps: false,
  }
);

Turma.sync({force:true})

Turma.belongsTo(Diretor, { foreignKey: "diretorId" });
Diretor.hasMany(Turma, { foreignKey: "diretorId" });
Turma.belongsTo(Ano, { foreignKey: "anoId" });
Ano.hasMany(Turma, { foreignKey: "anoId" });
Turma.belongsTo(Turno, { foreignKey: "turnoId" });
Turno.hasMany(Turma, { foreignKey: "turnoId" });

module.exports = Turma;
