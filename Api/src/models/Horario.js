const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');
const Dia = require('./Dia.js');

const Horario = sequelize.define(
	'horarios',
	{
		horarioId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		diaId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Dia,
				key: 'diaId'
			}
		},
		horas: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		minutos: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{
		timestamps: false
	}
);

// Horario.sync({ force: true });

Horario.belongsTo(Dia, { foreignKey: 'diaId' });
Dia.hasMany(Horario, { foreignKey: 'diaId' });

module.exports = Horario;
