const Administrador = require('../models/Administrador.js');
const Filme = require('../models/Filme.js');
const Genero = require('../models/Genero.js');
const Sessao = require('../models/Sessao.js');
const validate = require('../functions/validate.js');
const imageUploadHandle = require('../functions/imageUploadHandle.js');
const { unlink } = require('fs/promises');
const fetch = require('node-fetch');
require('dotenv').config();

// ==== CAMPOS ====
// nome
// sinopse
// dataEstreia
// poster
// disponivel3D
// disponivelLegendado

// ==== DEPENDE DE ====
// generoId
// administradorId

const filmeController = {
	create: async (req, res) => {
		let {
			administradorId: id,
			nome,
			sinopse,
			dataEstreia,
			poster,
			disponivel3D: d3D,
			disponivelLegendado: dLG,
			generoId,
			duracaoMinutos
		} = req.body;

		try {
			// Checanco se o adm existe
			const administrador = await Administrador.findByPk(id);
			if (!administrador) throw new Error('Você não tem permissão');

			// Validando os campos
			validate({ nome, isRequired: true });
			nome = nome.trim().toLowerCase();

			validate({ sinopse, isRequired: true });
			validate({
				'data de estreia': dataEstreia,
				type: 'data',
				isRequired: true
			});
			validate({ 'disponível em 3D': d3D, type: 'boolean', isRequired: true });
			validate({
				'disponível legendado': dLG,
				type: 'boolean',
				isRequired: true
			});
			validate({ 'id do genero': generoId, type: 'numero', isRequired: true });
			validate({
				'duração em minutos': duracaoMinutos,
				type: 'numero',
				isRequired: true
			});

			// Checando se o filme ja existe
			const filmeJaExiste = await Filme.findOne({ where: { nome: nome } });
			if (filmeJaExiste) throw new Error('Filme já cadastrado.');

			// Checando se o genero existe
			const genero = await Genero.findByPk(generoId);
			if (!genero) throw new Error('Genero não encontrado.');

			// Checando se poster veio como link
			if (poster !== undefined) {
				const validated = validate({ poster, isRequired: true });

				// Checar se a imagem existe
				let response;
				try {
					response = await fetch(poster);
					if (!response.ok) throw new Error();
				} catch (error) {
					if (error)
						return res.status(400).json({ erro: 'Link de imagem invalido.' });
				}

				if (validated) {
					const link = poster.split('/');
					const img = link.pop();
					poster = {
						url: link.join('/') + '/',
						img: img,
						alt: `Poster do filme ${nome}.`
					};
				}
			}

			// Checando se veio como arquivo de imagem e fazendo tratamento
			if (req.file) {
				const file = await imageUploadHandle(req.file);
				if (file) {
					poster = {
						url: process.env.URL + '/media/',
						img: file,
						alt: `Poster do filme ${nome}.`
					};
				}
			}

			// Criando o novo filme
			const filme = await Filme.create({
				administradorId: administrador.administradorId,
				nome,
				sinopse,
				dataEstreia,
				poster,
				disponivel3D: d3D,
				disponivelLegendado: dLG,
				generoId,
				duracaoMinutos
			});

			return res.status(200).json(filme);
		} catch (erro) {
			if (req.file) await unlink(req.file.path);
			return res.status(400).json({ erro: erro.message });
		}
	},
	getAll: async (req, res) => {
		let queries;
		if (req.url.includes('include'))
			queries = req.url.replaceAll('include=', '').split('?')[1].split('&');

		const includesQuery = {
			genero: {
				model: Genero,
				as: 'genero'
			},
			sessoes: {
				model: Sessao,
				as: 'sessoes'
			}
		};

		try {
			const filmes = await Filme.findAll({
				include: queries && queries.filter((query) => includesQuery[query])
			});

			return res.status(200).json(filmes);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	getById: async (req, res) => {
		const { filmeId } = req.params;

		let queries;
		if (req.url.includes('include'))
			queries = req.url.replaceAll('include=', '').split('?')[1].split('&');

		const includesQuery = {
			genero: {
				model: Genero,
				as: 'genero'
			},
			sessoes: {
				model: Sessao,
				as: 'sessoes'
			}
		};

		try {
			const filme = await Filme.findByPk(filmeId, {
				include: queries && queries.filter((query) => includesQuery[query])
			});

			if (!filme)
				return res.status(404).json({ erro: 'Filme não encontrado.' });

			return res.status(200).json(filme);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	update: async (req, res) => {
		let {
			administradorId: id,
			filmeId,
			nome,
			sinopse,
			dataEstreia,
			poster,
			disponivel3D: d3D,
			disponivelLegendado: dLG,
			generoId,
			duracaoMinutos
		} = req.body;

		try {
			// Checanco se o adm existe
			const administrador = await Administrador.findByPk(id);
			if (!administrador) throw new Error('Usuário não encontrado');

			// Pegando o filme
			const filme = await Filme.findByPk(filmeId);
			if (!filme) throw new Error('Filme não encontrado.');

			// Checando se o admin que solicitou mudanca é o mesmo que criou
			if (filme.administradorId !== administrador.administradorId)
				throw new Error('Você não tem permissão.');

			// Validando os campos
			validate({ sinopse });
			validate({ 'data de estreia': dataEstreia, type: 'data' });
			validate({ 'disponível em 3D': d3D, type: 'boolean' });
			validate({ 'disponível legendado': dLG, type: 'boolean' });
			validate({ 'duração em minutos': duracaoMinutos, type: 'numero' });

			// Checando se ja existe filme com o mesmo nome
			if (nome) {
				validate({ nome });
				nome = nome.trim().toLowerCase();

				const filmeJaExiste = await Filme.findOne({
					where: { nome: `${nome}` }
				});
				if (filmeJaExiste) throw new Error('Filme já cadastrado.');
			}

			// Checando se o genero existe
			if (generoId) {
				validate({ 'id do genero': generoId, type: 'numero' });

				const genero = await Genero.findByPk(generoId);
				if (!genero) throw new Error('Genero não encontrado.');
			}

			// Checando se poster veio como link
			if (poster && poster !== undefined) {
				const validated = validate({ poster });
				// Checar se a imagem existe
				let response;
				try {
					response = await fetch(poster);
					if (!response.ok) throw new Error();
				} catch (error) {
					if (error)
						return res.status(400).json({ erro: 'Link de imagem invalido.' });
				}

				if (filme.poster.url.includes(process.env.URL))
					await unlink(`./public/media/${filme.poster.img}`);

				if (validated) {
					const link = poster.split('/');
					const img = link.pop();
					poster = {
						url: link.join('/') + '/',
						img: img,
						alt: `Poster do filme ${filme.nome}.`
					};
				}
			}

			// Checando se veio como arquivo de imagem e fazendo tratamento
			if (req.file) {
				if (filme.poster.url.includes(process.env.URL))
					await unlink(`./public/media/${filme.poster.img}`);

				const file = await imageUploadHandle(req.file);
				if (file) {
					poster = {
						url: process.env.URL + '/media/',
						img: file,
						alt: `Poster do filme ${filme.nome}.`
					};
				}
			}

			// Criando o novo filme
			const filmeAtualizado = await filme.update({
				nome: nome ? nome : filme.nome,
				sinopse: sinopse ? sinopse : filme.sinopse,
				dataEstreia: dataEstreia ? dataEstreia : filme.dataEstreia,
				poster: poster ? poster : filme.poster,
				disponivel3D: d3D ? d3D : filme.disponivel3D,
				disponivelLegendado: dLG ? dLG : filme.disponivelLegendado,
				generoId: generoId ? generoId : filme.generoId,
				duracaoMinutos: duracaoMinutos ? duracaoMinutos : filme.duracaoMinutos
			});

			return res.status(200).json(filmeAtualizado);
		} catch (erro) {
			if (req.file) await unlink(req.file.path);
			return res.status(400).json({ erro: erro.message });
		}
	},
	delete: async (req, res) => {
		const { administradorId: id } = req.body;
		const { filmeId } = req.params;

		try {
			const administrador = await Administrador.findByPk(id);
			if (!administrador)
				return res.status(401).json({ erro: 'Você nao tem permissão.' });

			const filme = await Filme.findByPk(filmeId);
			if (!filme)
				return res.status(404).json({ erro: 'Filme não encontrado.' });

			if (filme.poster.url.includes(process.env.URL))
				await unlink(`./public/media/${filme.poster.img}`);

			const filmeDeletado = await filme.destroy();

			return res.status(200).json({
				mensagem: `Filme ${filmeDeletado.nome} foi excluido com sucesso.`
			});
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	}
};

module.exports = filmeController;
