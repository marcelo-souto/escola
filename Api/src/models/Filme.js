const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');
const Administrador = require('./Administrador.js');
const Genero = require('./Genero.js');

const Filme = sequelize.define(
	'filmes',
	{
		filmeId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: false
		},
		sinopse: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		dataEstreia: {
			type: DataTypes.DATEONLY
		},
		generoId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Genero,
				key: 'generoId'
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
		poster: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		disponivel3D: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		disponivelLegendado: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		duracaoMinutos: {
			type: DataTypes.INTEGER,
			allowNull: false
		}

	},
	{
		timestamps: false
	}
);

Filme.hasOne(Administrador, {
	foreignKey: 'administradorId',
	as: 'administrador'
});

Administrador.hasMany(Filme, { foreignKey: 'administradorId' });
Administrador.belongsTo(Filme, { foreignKey: 'administradorId' });

Filme.hasOne(Genero, { foreignKey: 'generoId' });

Genero.hasMany(Filme, { foreignKey: 'generoId' });
Filme.belongsTo(Genero, { foreignKey: 'generoId' });

// Filme.sync({ force: true });

module.exports = Filme;
