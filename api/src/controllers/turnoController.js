const Turno = require('../models/Turnos.js');

const turnoController = {
	create: async (req, res) => {
		const { periodo, diretorId: id } = req.body;

		try {
			const turnoFind = await Turno.findOne({ where: { periodo: periodo } });

			if (turnoFind) throw new Error('Turno já cadastrado.');

			const turno = await Turno.create({
				periodo: periodo,
				diretorId: id
			});

			return res
				.status(200)
				.json(`Periodo criada com sucesso: ${turno.periodo}`);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	},

	update: async (req, res) => {
		const { turnoId, periodo, diretorId: id } = req.body;

		try {
			const turno = await Turno.findByPk(turnoId);

			if (turno.diretorId != id)
				throw new Error(`Diretor não possuiur acesso a esse dado.`);
			if (!turno) throw new Error('Turno não cadastrado.');

			const turnoAtt = await turno.update({
				periodo: periodo
			});

			return res
				.status(200)
				.json(`Turno criada com sucesso: ${turnoAtt.periodo}`);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	},

	get: async (req, res) => {
		try {
			const turno = await Turno.findAll();

			return res.status(200).json(turno);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	},

	delete: async (req, res) => {
		const { turnoId, diretorId: id } = req.body;

		try {
			const turno = await Turno.findByPk(turnoId);

			if (turno.diretorId != id)
				throw new Error(`Diretor não possuiur acesso a esse dado.`);

			if (!turno) throw new Error('Turno não cadastrado.');

			return res
				.status(200)
				.json(`Turno deletado com sucesso: ${turno.periodo}`);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	}
};

module.exports = turnoController;
