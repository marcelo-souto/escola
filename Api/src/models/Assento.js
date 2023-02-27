const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');
const Sessao = require('./Sessao.js');

const Assento = sequelize.define(
	'assentos',
	{
		assentoId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		sessaoId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Sessao,
				key: 'sessaoId'
			}
		},
		tipo: {
			type: DataTypes.ENUM('meia', 'inteira', 'desconto'),
			allowNull: false
		},
		codigo: {
			type: DataTypes.STRING(3),
			allowNull: false
		}
	},
	{
		timestamps: false
	}
);

// Assento.sync({ force: true });

Assento.hasOne(Sessao, { foreignKey: 'sessaoId' });
Assento.belongsTo(Sessao, { foreignKey: 'sessaoId', as: 'sessao' }); // para criar relacao com ingresso eu acrescentei esse alias

Sessao.hasMany(Assento, { foreignKey: 'sessaoId' });

module.exports = Assento