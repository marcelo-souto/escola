const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');

const Dia = sequelize.define(
	'dias',
	{
		diaId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		data: {
			type: DataTypes.DATEONLY,
			allowNull: false
		}
	},
	{
		timestamps: false
	}
);

// Dia.sync({ force: true });

module.exports = Dia;
