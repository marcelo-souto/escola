const Genero = require('../models/Genero.js');
const Filme = require('../models/Filme.js');
const validate = require('../functions/validate.js');

const generoController = {
	create: async (req, res) => {
		const { nome } = req.body;

		try {
			validate({ nome, isRequired: true });

			const generoJaExiste = await Genero.findOne({
				where: {
					nome: nome.toLowerCase()
				}
			});

			if (generoJaExiste) throw new Error('Este genero já existe.');

			const genero = await Genero.create({
				nome: nome.toLowerCase()
			});

			return res.status(200).json(genero);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	getById: async (req, res) => {
		const { generoId } = req.params;
		const { include } = req.query;

		try {
			const genero = await Genero.findByPk(
				generoId,
				include && {
					include: include
				}
			);

			if (!genero)
				return res
					.status(404)
					.json({ erro: 'Este genero não foi encontrado.' });

			return res.status(200).json(genero);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	getAll: async (req, res) => {
		const { include } = req.query;

		try {
			const generos = await Genero.findAll(
				include && {
					include: include
				}
			);

			return res.status(200).json(generos);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	update: async (req, res) => {
		const { nome, generoId } = req.body;

		try {
			validate({ nome, isRequired: true });

			const generoJaExiste = await Genero.findOne({
				where: { nome: nome.toLowerCase() }
			});
			if (generoJaExiste)
				return res.status(400).json({ erro: 'Este genero já existe.' });

			const genero = await Genero.findByPk(generoId);
			if (!genero)
				return res.status(404).json({ erro: 'Genero não encontrado.' });

			const generoAtualizado = await genero.update({
				nome: nome.toLowerCase()
			});

			return res.status(200).json(generoAtualizado);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	delete: async (req, res) => {
		const { generoId } = req.params;

		try {
			const genero = await Genero.findByPk(generoId);
			if (!genero)
				return res.status(404).json({ erro: 'Genero não encontrado.' });

			const generoDeletado = await genero.destroy();

			return res.status(200).json({
				mensagem: `Genero ${generoDeletado.nome} foi excluido com sucesso.`
			});
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	}
};

module.exports = generoController;
