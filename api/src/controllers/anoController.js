const Ano = require('../models/Ano.js');

const anoController = {
	create: async (req, res) => {
		const { anoLetivo } = req.body;

		if (!anoLetivo)
			return res
				.status(400)
				.json({ erro: 'É obrigatório o envio da informação' });

		try {
			const anoExiste = await Ano.findOne({
				where: {
					anoLetivo: anoLetivo
				}
			});

			if (anoExiste)
				return res.status(400).json({ erro: 'Este ano já está cadastrado.' });

			const ano = await Ano.create({
				anoLetivo: anoLetivo
			});

			return res.status(200).json(`Ano criada com sucesso: ${ano.anoLetivo}`);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	},

	update: async (req, res) => {
		const { id, anoLetivo } = req.body;

		try {
			const ano = await Ano.findByPk(id);

			if (!ano)
				return res.status(404).json({ erro: 'Informação não encontrada.' });

			const anoAtualizado = await ano.update({
				anoLetivo: anoLetivo
			});

			return res
				.status(200)
				.json(`Ano criada com sucesso: ${anoAtualizado.anoLetivo}`);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	},

	getAll: async (req, res) => {
		try {
			const ano = await Ano.findAll();

			return res.status(200).json(ano);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	},

	delete: async (req, res) => {
		const { id } = req.body;

		try {
			const ano = await Ano.findByPk(id);

			if (!ano)
				return res.status(404).json({ erro: 'Informação não encontrada.' });

			const anoDeletado = await ano.destroy();

			return res
				.status(200)
				.json(`Ano deletado com sucesso: ${anoDeletado.anoLetivo}`);

		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	}
};

module.exports = anoController;
