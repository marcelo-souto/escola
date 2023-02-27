const sequelize = require('../database/database.js');
const { DataTypes } = require('sequelize');
const Diretor = require('./Diretor.js');
const Materia = require('./Materia.js');
const Turma = require('./Turma.js');
const TurmaProfessor = require('./TurmaProfessor.js');

const Professor = sequelize.define(
	'professores',
	{
		professorId: {
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
		cpf: {
			type: DataTypes.STRING,
			allowNull: false
		},
		senha: {
			type: DataTypes.STRING,
			allowNull: false
		},
		telefone: {
			type: DataTypes.STRING,
			allowNull: false
		},
		emailVerificado: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		dataNascimento: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		materiaId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Materia,
				key: 'materiaId'
			}
		},
		diretorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Diretor,
				key: 'diretorId'
			}
		}
	},
	{ timestamps: false }
);

Diretor.hasMany(Professor, { foreignKey: 'diretorId' });
Professor.hasOne(Diretor, { foreignKey: 'diretorId' });
Professor.belongsTo(Diretor, { foreignKey: 'diretorId' });

Materia.hasMany(Professor, { foreignKey: 'materiaId' });
Professor.hasOne(Materia, { foreignKey: 'materiaId' });

Professor.belongsToMany(Turma, {
	through: {
		model: TurmaProfessor
	},
	foreignKey: 'professorId',
	constraint: true
});

Turma.belongsToMany(Professor, {
	through: {
		model: TurmaProfessor
	},
	foreignKey: 'turmaId',
	constraint: true
});

Professor.hasMany(TurmaProfessor, { foreignKey: 'professorId' });
TurmaProfessor.belongsTo(Professor, { foreignKey: 'professorId' });

Turma.hasMany(TurmaProfessor, { foreignKey: 'turmaId' });
TurmaProfessor.belongsTo(Turma, { foreignKey: 'turmaId' });

// Professor.sync({force: true})
// Turma.sync({force: true})
// TurmaProfessor.sync({ force: true });

module.exports = Professor;
