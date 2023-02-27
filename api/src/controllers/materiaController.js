const Materia = require('../models/Materia.js');

require('dotenv').config();

const materiaController = {
	create: async (req, res) => {
		const { diretorId, nome } = req.body;

		try {
			const materiaExiste = await Materia.findOne({ where: { nome: nome } });
			if (materiaExiste) throw new Error('Materia ja cadastrada.');

			const materia = await Materia.create({
				nome: nome,
				diretorId: diretorId
			});

			return res.status(200).json(materia);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	}
};

module.exports = materiaController;
