const sharp = require('sharp');
const { unlink } = require('fs/promises');

const imageUploadHandle = async (file) => {
	try {
		const filename = `${file.filename}.jpg`;

		await sharp(file.path)
			.resize(570, 800, { fit: sharp.fit.cover })
			.toFormat('jpeg')
			.toFile(`./public/media/${filename}`);

		await unlink(file.path);

		return filename;
	} catch (error) {
		if (error)
			throw new Error('Houve algum problema durante o tratamento da imagem.');
	}
};

module.exports = imageUploadHandle;
