const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');

const Token = sequelize.define(
	'tokens',
	{
		tokenId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		timestamps: false
	}
);

  // Token.sync({force:true})

  module.exports = Token;