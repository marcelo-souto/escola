const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');
const Filme = require('./Filme.js');
const Sala = require('./Sala.js');
const Administrador = require('./Administrador.js');
const Dia = require('./Dia.js');

const Sessao = sequelize.define(
	'sessoes',
	{
		sessaoId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		filmeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Filme,
				key: 'filmeId'
			}
		},
		salaId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Sala,
				key: 'salaId'
			}
		},
		administradorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Administrador,
				key: 'administradorId'
			}
		},
		preco: {
			type: DataTypes.DECIMAL,
			allowNull: false
		},
		inicioMinuto: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		terminoMinuto: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		diaId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Dia,
				key: 'diaId'
			}
		}
	},
	{
		timestamps: false
	}
);

// Traz a sessao com o filme
Sessao.hasOne(Filme, { foreignKey: 'filmeId' });
Sessao.belongsTo(Filme, { foreignKey: 'filmeId' });
// Traz o filme com as sessoes
Filme.hasMany(Sessao, { foreignKey: 'filmeId' });

// Traz a sessao com a sala
Sessao.hasOne(Sala, { foreignKey: 'salaId' });
Sessao.belongsTo(Sala, { foreignKey: 'salaId' });
// Traz a sala com as sessoes
Sala.hasMany(Sessao, { foreignKey: 'salaId' });

// Traz o horario com as sessoes
// Horario.hasMany(Sessao, { foreignKey: 'horarioId' });

Sessao.hasOne(Administrador, {
	foreignKey: 'administradorId',
	as: 'administrador'
});

Administrador.hasMany(Sessao, { foreignKey: 'administradorId' });
Sessao.belongsTo(Administrador, { foreignKey: 'administradorId' });

Dia.hasMany(Sessao, { foreignKey: 'diaId' });
Sessao.belongsTo(Dia, { foreignKey: 'diaId' });

// Sessao.sync({ force: true });

module.exports = Sessao;
