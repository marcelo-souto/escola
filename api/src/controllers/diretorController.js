const Diretor = require('../models/Diretor.js');
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

const diretorController = {
	create: async (req, res) => {
		const { nome, cpf, dataNascimento, telefone, email, senha } = req.body;

		try {
			validate({ nome, isRequired: true });
			validate({ cpf, type: 'cpf', isRequired: true });
			validate({ 'data de nascimento': dataNascimento, type: 'data', isRequired: true });
			validate({ telefone, type: 'telefone', isRequired: true });
			validate({ email, type: 'email', isRequired: true });
			validate({ senha, type: 'senha', isRequired: true });
			

			const diretorJaExiste = await Diretor.findOne({
				where: {
					email: email
				}
			});

			if (diretorJaExiste) throw new Error('Email já cadastrado.');

			const diretorJaExisteCpf = await Diretor.findOne({
				where: {
					cpf: cpf
				}
			});

			if (diretorJaExisteCpf) throw new Error('Cpf já cadastrado.');

			const diretorJaExisteTel = await Diretor.findOne({
				where: {
					telefone: telefone
				}
			});

			if (diretorJaExisteTel) throw new Error('Telefone já cadastrado.');

			const senhaCriptografada = await hash(senha, 10);

			const diretor = await Diretor.create({
				nome: nome,
				cpf: cpf,
				dataNascimento: dataNascimento,
				telefone: telefone,
				email: email,
				emailVerificado: false,
				senha: senhaCriptografada
			});

			const id = `${diretor.diretorId}@D`;

			const emailToken = sign({ userId: id }, process.env.PRIVATE_KEY, {
				expiresIn: '1d'
			});

			const emailTokenDiretor = await Token.create({
				userId: id,
				token: emailToken
			});

			await transporter.sendMail({
				text: 'Autenticação',
				subject: 'Confirme seu email',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${diretor.email}`,
				html: emailConfirmationTemplate(
					'diretor',
					diretor.nome,
					emailTokenDiretor.token
				)
			});

			return res
				.status(200)
				.json({ mensagem: `Diretor ${diretor.nome} criado com sucesso.` });
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	},

	getAutenticate: async (req, res) => {
		const token = req.params.token;

		try {
			let userId = '';

			try {
				const resultado = verify(token, process.env.PRIVATE_KEY);

				if (!resultado) throw new Error();
				const id = resultado.userId.split('@');

				if (id[1] === 'D') userId = id[0];
				else throw new Error();
			} catch (error) {
				return res.status(400).json({ erro: 'Token Inválido.' });
			}

			const diretor = await Diretor.findByPk(userId);
			if (!diretor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const tokenValid = await Token.findOne({
				where: {
					[Op.and]: [{ userId: `${userId}@D` }, { token: token }]
				}
			});

			if (tokenValid) await tokenValid.destroy();

			if (!diretor.emailVerificado) {
				await diretor.update({ emailVerificado: true });
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

	auth: async (req, res) => {
		const { email, senha } = req.body;

		try {
			if (!email || !senha) throw new Error('Email e senha são obrigatórios.');

			const diretor = await Diretor.findOne({
				where: {
					email: email
				}
			});

			if (!diretor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			if (diretor.emailVerificado != true)
				return res.status(404).json({ erro: 'Usuário não verificado.' });

			const resultado = await compare(senha, diretor.senha);

			if (!resultado) throw new Error('Usuário ou senha inválida.');

			const token = sign(
				{ diretorId: diretor.diretorId },
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

	getInfo: async (req, res) => {
		const { diretorId: id } = req.body;

		try {
			const diretor = await Diretor.findByPk(id, {
				attributes: {
					exclude: ['senha', 'emailVerificado']
				}
			});

			if (!diretor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			return res.status(200).json(diretor);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},

	update: async (req, res) => {
		const {
			diretorId: id,
			email,
			nome,
			telefone,
			cpf,
			dataNascimento
		} = req.body;

		if (!email && !nome)
			return res.status(400).json({
				erro: 'Não foram enviadas informações para serem atualizadas.'
			});

		try {
			const diretor = await Diretor.findByPk(id);

			if (!diretor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			if (diretor.email === email)
				return res.status(400).json({
					erro: 'A informação a ser atualizada deve ser diferente da atual.'
				});

			validate({ nome });
			validate({ email, type: 'email' });
			validate({ telefone, type: 'telefone' });
			validate({ cpf, type: 'cpf' });
			validate({ 'data de nascimento': dataNascimento, type: 'data' });

			const infoJaCadastrada = await Diretor.findOne({
				where: {
					[Op.or]: [
						{ email: `${email}` },
						{ cpf: `${cpf}` },
						{ telefone: `${telefone}` }
					]
				}
			});

			if (infoJaCadastrada) {
				if (infoJaCadastrada.email === email)
					throw Error('Email já está sendo utilizado.');
				if (infoJaCadastrada.cpf === cpf) throw Error('CPF já cadastrado.');
				if (infoJaCadastrada.telefone === telefone)
					throw Error('Telefone já cadastrado.');
			}

			await diretor.update({
				nome: nome ? nome : diretor.nome,
				email: email ? email : diretor.email,
				telefone: telefone ? telefone : diretor.telefone,
				cpf: cpf ? cpf : diretor.cpf,
				dataNascimento: dataNascimento ? dataNascimento : diretor.dataNascimento
			});

			return res
				.status(201)
				.json({ mensagem: `Informações atualizadas com sucesso.` });
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},

	delete: async (req, res) => {
		const { diretorId: id } = req.body;

		try {
			const diretor = await Diretor.findByPk(id);

			if (!diretor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const diretorDeletado = await diretor.destroy();

			return res.status(200).json({
				mensagem: `Cadastro do usuário ${diretorDeletado.nome} excluido com sucesso.`
			});
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},

	resetPassword: async (req, res) => {
		const { email } = req.body;

		try {
			validate({ email, type: 'email', isRequired: true });

			const diretor = await Diretor.findOne({
				where: {
					email: `${email}`
				}
			});

			if (!diretor)
				return res.status(404).json({ erro: 'Email não foi encontrado.' });

			const senha = randomPasswordGenerate();
			const senhaCriptografada = await hash(senha, 10);

			await diretor.update({ senha: senhaCriptografada });

			await transporter.sendMail({
				text: 'Recuperação de Senha',
				subject: 'Recupere sua Senha',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${diretor.email}`,
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
		const { diretorId, senha, novaSenha, confirmacaoNovaSenha } = req.body;

		try {
			validate({ senha, type: 'senha', isRequired: true });
			validate({ 'senha nova': novaSenha, type: 'senha', isRequired: true });

			const diretor = await Diretor.findByPk(diretorId);
			if (!diretor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const resultado = await compare(senha, diretor.senha);
			if (!resultado) return res.status(400).json({ erro: 'Senha incorreta.' });

			if (novaSenha !== confirmacaoNovaSenha)
				return res.status(400).json({ erro: 'As senhas precisam ser iguais.' });

			if (senha === novaSenha)
				return res
					.status(400)
					.json({ erro: 'A senha nova deve ser diferente da atual' });

			const novaSenhaCriptografada = await hash(novaSenha, 10);

			await diretor.update({
				senha: novaSenhaCriptografada
			});

			const token = sign(
				{ diretorId: diretor.diretorId },
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

			const diretor = await Diretor.findOne({
				where: {
					email: `${email}`
				}
			});

			if (!diretor)
				return res.status(404).json({ erro: 'Email não encontrado.' });

			if (diretor.emailVerificado)
				return res.status(400).json({ erro: 'Email já verificado.' });

			const tokenEmail = await Token.findOne({
				where: {
					usuarioId: `${diretor.diretorId}@D`
				}
			});

			if (tokenEmail) await tokenEmail.destroy();

			const token = sign(
				{ usuarioId: `${diretor.diretorId}@D` },
				process.env.PRIVATE_KEY,
				{ expiresIn: '1d' }
			);

			const emailNovoToken = await Token.create({
				usuarioId: `${diretor.diretorId}@D`,
				token: token
			});

			await transporter.sendMail({
				text: 'Autenticação',
				subject: 'Confirme seu email',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${diretor.email}`,
				html: emailConfirmationTemplate(
					'diretor',
					diretor.nome,
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

module.exports = diretorController;
