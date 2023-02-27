const multer = require('multer');

const config = {
	dest: './temp',
	fileFilter: (req, file, callback) => {
		const allowedFiles = ['image/jpg', 'image/jpeg', 'image/png'];

		if (allowedFiles.includes(file.mimetype)) callback(null, true);
		else callback(new Error('Extensão de arquivo não aceita.', false));
	},
	limits: { fieldSize: 2000000 }
};

const uploadFile = async (req, res, next) => {
	const upload = multer(config).single('poster');
	const { administradorId } = req.body;

	upload(req, res, (erro) => {
		if (erro) return res.status(400).json({ erro: erro.message });
		else req.body.administradorId = administradorId

		next();
		return;
	});
};

module.exports = uploadFile;