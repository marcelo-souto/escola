const sequelize = require('../database/database.js');
const Turma = require('./Turma.js');
const { DataTypes } = require('sequelize');

const Aluno = sequelize.define(
	'alunos',
	{
		alunoId: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		senha: {
			type: DataTypes.STRING,
			allowNull: false
		},
		turmaId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: Turma,
				key: 'turmaId'
			}
		}
	},
	{ timestamps: false }
);

Aluno.hasOne(Turma, { foreignKey: 'turmaId' });
Aluno.belongsTo(Turma, { foreignKey: 'turmaId' });
Turma.hasMany(Aluno, { foreignKey: 'turmaId' });

// Aluno.sync({ force: true });

module.exports = Aluno