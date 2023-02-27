const Sala = require('../models/Sala.js');
const Sessao = require('../models/Sessao.js');
const validate = require('../functions/validate.js');

const salaController = {
	create: async (req, res) => {
		const { numero, totalAssentos, totalFilas } = req.body;

		try {
			const salaJaExiste = await Sala.findOne({ where: { numero: numero } });
			if (salaJaExiste)
				return res
					.status(400)
					.json({ erro: 'Já existe uma sala com esse número.' });

			validate({ numero, type: 'numero', isRequired: true });
			validate({
				'total de assentos': totalAssentos,
				type: 'numero',
				isRequired: true
			});
			validate({
				'total de filas': totalFilas,
				type: 'numero',
				isRequired: true
			});

			const sala = await Sala.create({
				numero,
				totalAssentos,
				totalFilas
			});

			return res.status(201).json(sala);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	update: async (req, res) => {
		const { salaId, numero, totalAssentos, totalFilas } = req.body;

		try {
			const sala = await Sala.findByPk(salaId);
			if (!sala) return res.status(404).json({ erro: 'Sala não encontrada.' });

			validate({ numero, type: 'numero' });
			validate({
				'total de assentos': totalAssentos,
				type: 'numero'
			});
			validate({
				'total de filas': totalFilas,
				type: 'numero'
			});

			const salaAtualizada = await sala.update({
				numero: numero ? numero : sala.numero,
				totalAssentos: totalAssentos ? totalAssentos : sala.totalAssentos,
				totalFilas: totalFilas ? totalFilas : sala.totalFilas
			});

			return res.status(200).json(salaAtualizada);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	delete: async (req, res) => {
		const { salaId } = req.params;

		try {
			const sala = await Sala.findByPk(salaId);
			if (!sala) return res.status(404).json({ erro: 'Sala não encontrada.' });

			const salaDeletada = await sala.destroy();
			return res.status(200).json({
				mensagem: `Sala numero ${salaDeletada.numero} excluida com sucesso.`
			});
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	getAll: async (req, res) => {
		const { include } = req.query;
		try {
			const salas = await Sala.findAll(
				include && {
					include: {
						model: Sessao,
						as: 'sessoes'
					}
				}
			);
			return res.status(200).json(salas);
		} catch (error) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	getById: async (req, res) => {
		const { salaId } = req.params;
		const { include } = req.query;

		try {
			const sala = await Sala.findByPk(
				salaId,
				include && {
					include: {
						model: Sessao,
						as: 'sessoes'
					}
				}
			);

			if (!sala) return res.status(404).json({ erro: 'Sala não encontrada.' });

			return res.status(200).json(sala);
		} catch (error) {
			return res.status(400).json({ erro: erro.message });
		}
	}
};

module.exports = salaController;

module.exports = salaController;