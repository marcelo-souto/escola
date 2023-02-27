const Dia = require('../models/Dia.js');
const validate = require('../functions/validate.js');

const diaController = {
	create: async (req, res) => {
		const { data } = req.body;

		try {
			validate({ date: data, type: 'data', isRequired: true });

			const findData = await Dia.findOne({ where: { data: data } });

			if (findData) throw new Error('Data já consta no banco de dados');

			const novaData = await Dia.create({
				data: data
			});

			return res
				.status(200)
				.json({ mensagem: `Data criada com sucesso: ${novaData.data}` });
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	}
};
module.exports = diaController;
