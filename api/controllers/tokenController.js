const { verify } = require('jsonwebtoken');
require('dotenv').config()

const tokenController = {
	validate: async (req, res) => {
		const { token } = req.body;

		try {
			if (!token) throw new Error();
    
			const resultado = verify(token, process.env.PRIVATE_KEY);
			if (resultado) return res.status(200).json(true);

		} catch (error) {
			return res.status(401).json(false);
		}
	}

};

module.exports = tokenController