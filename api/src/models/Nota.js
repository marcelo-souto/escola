const sequelize = require('../database/database.js');
const Aluno = require('./Aluno.js');
const Professor = require('./Professor.js');
const { DataTypes } = require('sequelize');

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
		professorId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: Professor,
				key: 'professorId'
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