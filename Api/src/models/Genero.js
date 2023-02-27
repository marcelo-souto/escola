const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');

const Genero = sequelize.define(
	'generos',
	{
		generoId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		nome: {
			type: DataTypes.STRING
		}
	},
	{
		timestamps: false
	}
);

// Genero.sync({ force: true });

module.exports = Genero;
