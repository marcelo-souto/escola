const sequelize = require("../database/database.js");
const { DataTypes } = require("sequelize");
const Turno = require("./Turnos");
const Ano = require("./Ano");

const Turma = sequelize.define(
  "turmas",
  {
    turmaId: {
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

    codigo: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.turnoId * 1000 + this.anoId * 100 + this.id;
      },
    },
  },
  {
    timestamps: false,
  }
);

// Turma.sync({force:true})

Turma.belongsTo(Ano, { foreignKey: "anoId" });
Ano.hasMany(Turma, { foreignKey: "anoId" });
Turma.belongsTo(Turno, { foreignKey: "turnoId" });
Turno.hasMany(Turma, { foreignKey: "turnoId" });

module.exports = Turma;
