const Administrador = require('../models/Administrador.js');
const Token = require('../models/Token.js');
const emailConfirmationTemplate = require('../functions/templateUserConfirmationEmail.js');
const emailRecoverPasswordTemplate = require('../functions/templateUserRecoverPassword.js');
const randomPasswordGenerate = require('../functions/ramdomPasswordGenerate.js');
const { Op } = require('sequelize');
const validate = require('../functions/validate.js');
const nodemailer = require('nodemailer');
const { hash, compare } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const dotenv = require('dotenv');
const Cliente = require('../models/Cliente.js');

dotenv.config();

const transporter = nodemailer.createTransport({
	host: process.env.E_HOST,
	port: process.env.E_PORT,
	secure: false,
	auth: {
		user: process.env.E_USER,
		pass: process.env.E_PASS
	},
	tls: {
		rejectUnauthorized: false
	}
});

const administradorController = {
	create: async (req, res) => {
		const { nome, email, senha } = req.body;

		try {
			validate({ nome, isRequired: true });
			validate({ email, type: 'email', isRequired: true });
			validate({ senha, type: 'senha', isRequired: true });

			const administradorJaExiste = await Administrador.findOne({
				where: {
					email: email
				}
			});

			if (administradorJaExiste) throw new Error('Usuário já cadastrado.');

			const senhaCriptografada = await hash(senha, 10);

			const administrador = await Administrador.create({
				nome,
				email,
				senha: senhaCriptografada,
				emailVerificado: false
			});

			const id = `${administrador.administradorId}@A`;

			const emailToken = sign({ usuarioId: id }, process.env.PRIVATE_KEY, {
				expiresIn: '1d'
			});

			const emailTokenAdministrador = await Token.create({
				usuarioId: id,
				token: emailToken
			});

			await transporter.sendMail({
				text: 'Autenticação',
				subject: 'Confirme seu email',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${administrador.email}`,
				html: emailConfirmationTemplate(
					'admin',
					administrador.nome,
					emailTokenAdministrador.token
				)
			});

			return res.status(201).json(administrador);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	auth: async (req, res) => {
		const { email, senha } = req.body;

		try {
			if (!email || !senha) throw new Error('Email e senha são obrigatórios.');

			const administrador = await Administrador.findOne({
				where: {
					email: email
				}
			});

			if (!administrador)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const resultado = await compare(senha, administrador.senha);

			if (!resultado) throw new Error('Usuário ou senha inválida.');

			if (!administrador.emailVerificado)
				throw new Error('Email não verificado.');

			const token = sign(
				{ administradorId: administrador.administradorId },
				process.env.PRIVATE_KEY,
				{ expiresIn: '1d' }
			);

			return res
				.status(200)
				.json({ mensagem: 'Login realizado com sucesso', token });
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	getAutenticate: async (req, res) => {
		const token = req.params.token;
		try {
			let usuarioId = '';

			try {
				const resultado = verify(token, process.env.PRIVATE_KEY);
				if (!resultado) throw new Error();
				const id = resultado.usuarioId.split('@');

				if (id[1] === 'A') usuarioId = id[0];
				else throw new Error();
			} catch (error) {
				return res.status(400).json({ erro: 'Token Inválido.' });
			}

			const administrador = await Administrador.findByPk(usuarioId);
			if (!administrador)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const tokenValid = await Token.findOne({
				where: {
					[Op.and]: [{ usuarioId: `${usuarioId}@A` }, { token: token }]
				}
			});

			if (tokenValid) await tokenValid.destroy();

			if (!administrador.emailVerificado) {
				await administrador.update({ emailVerificado: true });
				return res
					.status(200)
					.json({ mensagem: 'Email verificado com sucesso.' });
			} else {
				return res.status(400).json({ erro: 'Email já verificado.' });
			}
		} catch (erro) {
			return res.status(401).json({ erro: erro.message });
		}
	},
	getInfo: async (req, res) => {
		const { administradorId: id } = req.body;

		try {
			const administrador = await Administrador.findByPk(id, {
				attributes: {
					exclude: ['senha', 'emailVerificado']
				}
			});

			if (!administrador)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			return res.status(200).json(administrador);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	update: async (req, res) => {
		const { administradorId: id, email, nome } = req.body;

		if (!email && !nome)
			return res.status(400).json({
				erro: 'Não foram enviadas informações para serem atualizadas.'
			});

		try {
			const administrador = await Administrador.findByPk(id);

			if (!administrador)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			if (administrador.email === email)
				return res.status(400).json({
					erro: 'A informação a ser atualizada deve ser diferente da atual.'
				});

			validate({ nome });
			validate({ email, type: 'email' });

			const emailJaCadastrado = await Administrador.findOne({
				where: {
					email: `${email}`
				}
			});

			if (emailJaCadastrado)
				return res.status(400).json({ erro: 'Email já cadastrado.' });

			await administrador.update({
				nome: nome ? nome : administrador.nome,
				email: email ? email : administrador.email
			});

			return res
				.status(201)
				.json({ mensagem: `Informações atualizadas com sucesso.` });
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	delete: async (req, res) => {
		const { administradorId: id } = req.body;

		try {
			const administrador = await Administrador.findByPk(id);

			if (!administrador)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const administradorDeletado = await administrador.destroy();

			return res.status(200).json({
				mensagem: `Cadastro do usuário ${administradorDeletado.nome} excluido com sucesso.`
			});
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	resetPassword: async (req, res) => {
		const { email } = req.body;

		try {
			validate({ email, type: 'email', isRequired: true });

			const administrador = await Administrador.findOne({
				where: {
					email: `${email}`
				}
			});

			if (!administrador)
				return res.status(404).json({ erro: 'Email não foi encontrado.' });

			const senha = randomPasswordGenerate();
			const senhaCriptografada = await hash(senha, 10);

			await administrador.update({ senha: senhaCriptografada });

			await transporter.sendMail({
				text: 'Recuperação de Senha',
				subject: 'Recupere sua Senha',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${administrador.email}`,
				html: emailRecoverPasswordTemplate(senha)
			});

			return res
				.status(200)
				.json({ message: 'Email de recuperação se senha enviado.' });
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	changePassword: async (req, res) => {
		const { administradorId, senha, novaSenha, confirmacaoNovaSenha } =
			req.body;

		try {
			validate({ senha, type: 'senha', isRequired: true });
			validate({ 'senha nova': novaSenha, type: 'senha', isRequired: true });

			const administrador = await Administrador.findByPk(administradorId);
			if (!administrador)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const resultado = await compare(senha, administrador.senha);
			if (!resultado) return res.status(400).json({ erro: 'Senha incorreta.' });

			if (novaSenha !== confirmacaoNovaSenha)
				return res.status(400).json({ erro: 'As senhas precisam ser iguais.' });

			if (senha === novaSenha)
				return res
					.status(400)
					.json({ erro: 'A senha nova deve ser diferente da atual' });

			const novaSenhaCriptografada = await hash(novaSenha, 10);

			await administrador.update({
				senha: novaSenhaCriptografada
			});

			const token = sign(
				{ administradorId: administrador.administradorId },
				process.env.PRIVATE_KEY,
				{ expiresIn: '1d' }
			);

			return res
				.status(200)
				.json({ mensagem: 'Senha atualizada com sucesso.', token });
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	resendVerificationEmail: async (req, res) => {
		const { email } = req.body;

		try {
			if (!email)
				return res.status(400).json({ erro: 'Campo email é obrigatório.' });

			const administrador = await Administrador.findOne({
				where: {
					email: `${email}`
				}
			});

			if (!administrador)
				return res.status(404).json({ erro: 'Email não encontrado.' });

			if (administrador.emailVerificado)
				return res.status(400).json({ erro: 'Email já verificado.' });

			const tokenEmail = await Token.findOne({
				where: {
					usuarioId: `${administrador.administradorId}@A`
				}
			})

			if (tokenEmail) await tokenEmail.destroy()

			const token = sign(
				{ usuarioId: `${administrador.administradorId}@A` },
				process.env.PRIVATE_KEY,
				{ expiresIn: '1d' }
			);

			const emailNovoToken = await Token.create({
				usuarioId: `${administrador.administradorId}@A`,
				token: token
			})

			await transporter.sendMail({
				text: 'Autenticação',
				subject: 'Confirme seu email',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${administrador.email}`,
				html: emailConfirmationTemplate(
					'admin',
					administrador.nome,
					emailNovoToken.token
				)
			});

			return res
				.status(200)
				.json({ mensagem: 'Email de verificação enviado.' });

		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	}
};

module.exports = administradorController;
