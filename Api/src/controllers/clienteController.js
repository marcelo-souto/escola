const Cliente = require('../models/Cliente.js');
const Token = require('../models/Token.js');
const Ingresso = require('../models/Ingresso.js');
const emailConfirmationTemplate = require('../functions/templateUserConfirmationEmail.js');
const emailRecoverPasswordTemplate = require('../functions/templateUserRecoverPassword.js');
const randomPasswordGenerate = require('../functions/ramdomPasswordGenerate.js');
const { Op } = require('sequelize');
const validate = require('../functions/validate.js');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcrypt');
const dotenv = require('dotenv');

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

const clienteController = {
	post: async (req, res) => {
		const { nome, email, senha } = req.body;

		try {
			validate({ nome: nome, isRequired: true });
			validate({ email: email, type: 'email', isRequired: true });
			validate({ senha: senha, type: 'senha', isRequired: true });

			const clienteJaExiste = await Cliente.findOne({
				where: { email: email }
			});

			if (clienteJaExiste) throw new Error('Usuário já cadastrado');

			const senhaCriptografada = await hash(senha, 10);

			const cliente = await Cliente.create({
				nome,
				email,
				senha: senhaCriptografada,
				emailVerificado: false
			});

			const id = `${cliente.clienteId}@C`;

			const emailToken = jwt.sign({ usuarioId: id }, process.env.PRIVATE_KEY, {expiresIn: '1d'});

			const emailTokenCliente = await Token.create({
				usuarioId: id,
				token: emailToken
			});

			await transporter.sendMail({
				text: 'Autenticação',
				subject: 'Confirme seu email',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${cliente.email}`,
				html: emailConfirmationTemplate(
					'cliente',
					cliente.nome,
					emailTokenCliente.token
				)
			});

			return res.status(201).json(cliente);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	},

	auth: async (req, res) => {
		const { email, senha } = req.body;

		try {
			if (!email || !senha) throw new Error('Email e senha são obrigatórios.');

			const cliente = await Cliente.findOne({
				where: {
					email: email
				}
			});

			console.log(cliente)

			if (!cliente)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const resultado = await compare(senha, cliente.senha);

			if (!resultado) throw new Error('Usuário ou senha inválida.');

			if (!cliente.emailVerificado) throw new Error('Email não verificado.');

			const token = jwt.sign(
				{ clienteId: cliente.clienteId },
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
				const resultado = jwt.verify(token, process.env.PRIVATE_KEY);
				if (!resultado) throw new Error();
				const id = resultado.usuarioId.split('@');

				if (id[1] === 'C') usuarioId = id[0];
				else throw new Error();
			} catch (error) {
				return res.status(400).json({ erro: 'Token Inválido.' });
			}

			const cliente = await Cliente.findByPk(usuarioId);
			if (!cliente)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const tokenValid = await Token.findOne({
				where: {
					[Op.and]: [{ usuarioId: `${usuarioId}@C` }, { token: token }]
				}
			});

			if (tokenValid) await tokenValid.destroy();

			if (!cliente.emailVerificado) {
				await cliente.update({ emailVerificado: true });
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
		const { clienteId } = req.body;

		let queries;
		if (req.url.includes('include'))
			queries = req.url.replaceAll('include=', '').split('?')[1].split('&');

		const includesQuery = {
			ingressos: {
				model: Ingresso,
				as: 'ingressos'
			}
		};

		try {
			const cliente = await Cliente.findByPk(clienteId, {
				include: queries && queries.filter((query) => includesQuery[query]),
				attributes: {
					exclude: ['senha', 'emailVerificado']
				}
			});

			if (!cliente)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });
			if (!cliente)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			return res.status(200).json(cliente);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},

	update: async (req, res) => {
		const { clienteId, email, nome } = req.body;

		if (!email && !nome)
			return res.status(400).json({
				erro: 'Não foram enviadas informações para serem atualizadas.'
			});

		try {
			const cliente = await Cliente.findByPk(clienteId);

			if (!cliente)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			if (cliente.email === email)
				return res.status(400).json({
					erro: 'A informação a ser atualizada deve ser diferente da atual.'
				});

			validate({ nome });
			validate({ email, type: 'email' });

			const emailJaCadastrado = await Cliente.findOne({
				where: {
					email: `${email}`
				}
			});

			if (emailJaCadastrado)
				return res.status(400).json({ erro: 'Email já cadastrado.' });

			await cliente.update({
				nome: nome ? nome : cliente.nome,
				email: email ? email : cliente.email
			});

			return res
				.status(201)
				.json({ mensagem: `Informações atualizadas com sucesso.` });
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},

	delete: async (req, res) => {
		const { clienteId } = req.body;

		try {
			const cliente = await Cliente.findByPk(clienteId);

			if (!cliente)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const clienteDeletado = await cliente.destroy();

			return res.status(200).json({
				mensagem: `Cadastro do usuário ${clienteDeletado.nome} excluido com sucesso.`
			});
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	resetPassword: async (req, res) => {
		const { email } = req.body;

		try {
			validate({ email, type: 'email', isRequired: true });

			const cliente = await Cliente.findOne({
				where: {
					email: `${email}`
				}
			});

			if (!cliente)
				return res.status(404).json({ erro: 'Email não foi encontrado.' });

			const senha = randomPasswordGenerate();
			const senhaCriptografada = await hash(senha, 10);

			await cliente.update({ senha: senhaCriptografada });

			await transporter.sendMail({
				text: 'Recuperação de Senha',
				subject: 'Recupere sua Senha',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${cliente.email}`,
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
		const { clienteId, senha, novaSenha, confirmacaoNovaSenha } = req.body;

		try {
			validate({ senha, type: 'senha', isRequired: true });
			validate({ 'senha nova': novaSenha, type: 'senha', isRequired: true });

			const cliente = await Cliente.findByPk(clienteId);
			if (!cliente)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const resultado = await compare(senha, cliente.senha);
			if (!resultado) return res.status(400).json({ erro: 'Senha incorreta.' });

			if (novaSenha !== confirmacaoNovaSenha)
				return res.status(400).json({ erro: 'As senhas precisam ser iguais.' });

			if (senha === novaSenha)
				return res
					.status(400)
					.json({ erro: 'A senha nova deve ser diferente da atual' });

			const novaSenhaCriptografada = await hash(novaSenha, 10);

			await cliente.update({
				senha: novaSenhaCriptografada
			});

			const token = jwt.sign(
				{ clienteId: cliente.clienteId },
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

			const cliente = await Cliente.findOne({
				where: {
					email: `${email}`
				}
			});

			if (!cliente)
				return res.status(404).json({ erro: 'Email não encontrado.' });

			if (cliente.emailVerificado)
				return res.status(400).json({ erro: 'Email já verificado.' });

			const tokenEmail = await Token.findOne({
				where: {
					usuarioId: `${cliente.clienteId}@C`
				}
			})

			if (tokenEmail) await tokenEmail.destroy()

			const token = jwt.sign(
				{ usuarioId: `${cliente.clienteId}@C` },
				process.env.PRIVATE_KEY,
				{ expiresIn: '1d' }
			);

			const emailNovoToken = await Token.create({
				usuarioId: `${cliente.clienteId}@C`,
				token: token
			})

			await transporter.sendMail({
				text: 'Autenticação',
				subject: 'Confirme seu email',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${cliente.email}`,
				html: emailConfirmationTemplate(
					'cliente',
					cliente.nome,
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

module.exports = clienteController;
