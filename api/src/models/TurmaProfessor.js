const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');

const TurmaProfessor = sequelize.define(
	'turmaProfessor',
	{
		turmaProfessorId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		}
	},
	{ tableName: 'turmaProfessores', timestamps: false }
);

// TurmaProfessor.sync()

module.exports = TurmaProfessor;
