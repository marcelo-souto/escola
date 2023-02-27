const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');

const Administrador = sequelize.define(
	'administradores',
	{
		administradorId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
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
		emailVerificado: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	},
	{
		timestamps: false
	}
);

// Administrador.sync({ force: true });

module.exports = Administrador;
