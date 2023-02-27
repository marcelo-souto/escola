const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');

const Sala = sequelize.define(
	'salas',
	{
		salaId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		numero: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		totalAssentos: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		totalFilas: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{
		timestamps: false
	}
);

module.exports = Sala;
