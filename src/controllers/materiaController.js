const Materia = require('../models/Materia.js')

require('dotenv').config()

const tokenController = {
	create: async (req, res) => {
		const { id,nome } = req.body;

		try {

			const materia = Materia.create(

                {
                    nome:nome,
                    diretorId:id
                }

            );

			return res.status(200).json(materia);

		} catch (error) {
			return res.status(401).json(false);
		}
	}

};

module.exports = tokenController