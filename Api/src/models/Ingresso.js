const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');
const Cliente = require('./Cliente.js');
const Assento = require('./Assento.js');

const Ingresso = sequelize.define(
	'ingressos',
	{
		ingressoId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		clienteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Cliente,
				key: 'clienteId'
			}
		},
		assentoId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Assento,
				key: 'assentoId'
			}
		},
		total: {
			type: DataTypes.DECIMAL,
			allowNull: false
		}
	},
	{
		timestamps: false
	}
);

// Ingresso.sync({ force: true });

Ingresso.hasOne(Cliente, { foreignKey: 'clienteId' });
Ingresso.belongsTo(Cliente, { foreignKey: 'clienteId' });

Cliente.hasMany(Ingresso, { foreignKey: 'clienteId' });

Ingresso.hasOne(Assento, { foreignKey: 'assentoId' });
Ingresso.belongsTo(Assento, { foreignKey: 'assentoId' });

Assento.hasOne(Ingresso, { foreignKey: 'assentoId' });

module.exports = Ingresso;
