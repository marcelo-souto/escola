const sequelize = require('../database/database.js');
const Aluno = require('./Aluno.js');
const { DataTypes } = require('sequelize');
const Materia = require('./Materia.js');

const Nota = sequelize.define(
	'notas',
	{
		notaId: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		alunoId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: Aluno,
				key: 'alunoId'
			}
		},
		materiaId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: Materia,
				key: 'materiaId'
			}
		},
		b1: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		b2: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		b3: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		b4: {
			type: DataTypes.DECIMAL,
			allowNull: true
		}
	},

	{ timestamps: false }
);

// Turma.sync({force:true})

Nota.belongsTo(Aluno, { foreignKey: "alunoId" });
Nota.hasMany(Aluno, { foreignKey: "alunoId" })
Aluno.hasMany(Nota, { foreignKey: "alunoId" })

module.exports = Turma;