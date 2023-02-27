const sequelize = require("../database/database.js");
const { DataTypes } = require("sequelize");
const Diretor = require("./Diretor");

const Materia = sequelize.define(
  "materias",
  {
    materiaId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome: {
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
    },
  },
  {
    timestamps: false,
  }
);

Materia.sync({ force: true });

Materia.belongsTo(Diretor, { foreignKey: "diretorId" });
Materia.hasOne(Diretor, { foreignKey: "diretorId" });
Diretor.hasMany(Materia, { foreignKey: "diretorId" });

module.exports = Materia;
