const Diretor = require('../models/Diretor.js');
const Professor = require('../models/Professor.js');
const Token = require('../models/Token.js');
const emailConfirmationTemplate = require('../functions/templateUserConfirmationEmail.js');
const emailRecoverPasswordTemplate = require('../functions/templateUserRecoverPassword.js');
const randomPasswordGenerate = require('../functions/ramdomPasswordGenerate.js');
const { Op } = require('sequelize');
const validate = require('../functions/validate.js');
const nodemailer = require('nodemailer');
const { hash, compare } = require('bcrypt');
const  { sign, verify } = require('jsonwebtoken');
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

const professorController = {
	create: async (req, res) => {
		const {
			nome,
			cpf,
			dataNascimento,
			telefone,
			email,
			senha,
			materiaId,
			diretorId
		} = req.body;

		try {
			validate({ nome, isRequired: true });
			validate({ cpf, type: 'cpf', isRequired: true });
			validate({
				'data de nascimento': dataNascimento,
				type: 'data',
				isRequired: true
			});
			validate({ telefone, type: 'telefone', isRequired: true });
			validate({ email, type: 'email', isRequired: true });
			validate({ senha, type: 'senha', isRequired: true });
      validate({'materia': materiaId, type: 'numero', isRequired: true})


			const diretor = await Diretor.findByPk(diretorId);
      if (!diretor) return res.status(404).json({erro: 'Diretor não encontrado.'})

			const infoJaCadastrada = await Professor.findOne({
				where: {
					[Op.or]: [
						{ email: `${email}` },
						{ cpf: `${cpf}` },
						{ telefone: `${telefone}` }
					]
				}
			});

			if (infoJaCadastrada) {
				if (infoJaCadastrada.email === email) throw Error('Email já está sendo utilizado.');
				if (infoJaCadastrada.cpf === cpf) throw Error('CPF já cadastrado.');
				if (infoJaCadastrada.telefone === telefone) throw Error('Telefone já cadastrado.');
			}

			const senhaCriptografada = await hash(senha, 10);

			const professor = await Professor.create({
				nome: nome,
				cpf: cpf,
				dataNascimento: dataNascimento,
				telefone: telefone,
				email: email,
				emailVerificado: false,
				senha: senhaCriptografada,
        materiaId: materiaId,
        diretorId: diretorId
			});

			const id = `${professor.professorId}@P`;

			const emailToken = sign({ userId: id }, process.env.PRIVATE_KEY, {
				expiresIn: '1d'
			});

			const emailTokenProfessor = await Token.create({
				userId: id,
				token: emailToken
			});

			await transporter.sendMail({
				text: 'Autenticação',
				subject: 'Confirme seu email',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${professor.email}`,
				html: emailConfirmationTemplate(
					'professor',
					professor.nome,
					emailTokenProfessor.token
				)
			});

			return res
				.status(200)
				.json({ mensagem: `Professor ${professor.nome} criado com sucesso.` });

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

				if (id[1] === 'P') userId = id[0];
				else throw new Error();
			} catch (error) {
				return res.status(400).json({ erro: 'Token Inválido.' });
			}

			const professor = await Professor.findByPk(userId);
			if (!professor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const tokenValid = await Token.findOne({
				where: {
					[Op.and]: [{ userId: `${userId}@P` }, { token: token }]
				}
			});

			if (tokenValid) await tokenValid.destroy();

			if (!professor.emailVerificado) {
				await professor.update({ emailVerificado: true });
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

			const professor = await Professor.findOne({
				where: {
					email: email
				}
			});

			if (!professor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			if (professor.emailVerificado != true)
				return res.status(404).json({ erro: 'Usuário não verificado.' });

			const resultado = await compare(senha, professor.senha);

			if (!resultado) throw new Error('Usuário ou senha inválida.');

			const token = sign(
				{ professorId: professor.professorId },
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
		const { professorId: id } = req.body;

		try {
			const professor = await Professor.findByPk(id, {
				attributes: {
					exclude: ['senha', 'emailVerificado']
				}
			});

			if (!professor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			return res.status(200).json(professor);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},

	update: async (req, res) => {
		const {
			professorId: id,
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
			const professor = await Professor.findByPk(id);

			if (!professor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			if (professor.email === email)
				return res.status(400).json({
					erro: 'A informação a ser atualizada deve ser diferente da atual.'
				});

			validate({ nome });
			validate({ email, type: 'email' });
			validate({ telefone, type: 'telefone' });
			validate({ cpf, type: 'cpf' });
			validate({ 'data de nascimento': dataNascimento, type: 'data' });

			const infoJaCadastrada = await Professor.findOne({
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

			await professor.update({
				nome: nome ? nome : professor.nome,
				email: email ? email : professor.email,
				telefone: telefone ? telefone : professor.telefone,
				cpf: cpf ? cpf : professor.cpf,
				dataNascimento: dataNascimento ? dataNascimento : professor.dataNascimento
			});

			return res
				.status(201)
				.json({ mensagem: `Informações atualizadas com sucesso.` });

		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},

	delete: async (req, res) => {
		const { professorId: id } = req.body;

		try {
			const professor = await Professor.findByPk(id);

			if (!professor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const professorDeletado = await professor.destroy();

			return res.status(200).json({
				mensagem: `Cadastro do usuário ${professorDeletado.nome} excluido com sucesso.`
			});
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},

	resetPassword: async (req, res) => {
		const { email } = req.body;

		try {
			validate({ email, type: 'email', isRequired: true });

			const professor = await Professor.findOne({
				where: {
					email: `${email}`
				}
			});

			if (!professor)
				return res.status(404).json({ erro: 'Email não foi encontrado.' });

			const senha = randomPasswordGenerate();
			const senhaCriptografada = await hash(senha, 10);

			await professor.update({ senha: senhaCriptografada });

			await transporter.sendMail({
				text: 'Recuperação de Senha',
				subject: 'Recupere sua Senha',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${professor.email}`,
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
		const { professorId, senha, novaSenha, confirmacaoNovaSenha } = req.body;

		try {
			validate({ senha, type: 'senha', isRequired: true });
			validate({ 'senha nova': novaSenha, type: 'senha', isRequired: true });

			const professor = await Professor.findByPk(professorId);
			if (!professor)
				return res.status(404).json({ erro: 'Usuário não encontrado.' });

			const resultado = await compare(senha, professor.senha);
			if (!resultado) return res.status(400).json({ erro: 'Senha incorreta.' });

			if (novaSenha !== confirmacaoNovaSenha)
				return res.status(400).json({ erro: 'As senhas precisam ser iguais.' });

			if (senha === novaSenha)
				return res
					.status(400)
					.json({ erro: 'A senha nova deve ser diferente da atual' });

			const novaSenhaCriptografada = await hash(novaSenha, 10);

			await professor.update({
				senha: novaSenhaCriptografada
			});

			const token = sign(
				{ professorId: professor.professorId },
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

			const professor = await Professor.findOne({
				where: {
					email: `${email}`
				}
			});

			if (!professor)
				return res.status(404).json({ erro: 'Email não encontrado.' });

			if (professor.emailVerificado)
				return res.status(400).json({ erro: 'Email já verificado.' });

			const tokenEmail = await Token.findOne({
				where: {
					usuarioId: `${professor.professorId}@P`
				}
			});

			if (tokenEmail) await tokenEmail.destroy();

			const token = sign(
				{ usuarioId: `${professor.professorId}@P` },
				process.env.PRIVATE_KEY,
				{ expiresIn: '1d' }
			);

			const emailNovoToken = await Token.create({
				usuarioId: `${professor.professorId}@P`,
				token: token
			});

			await transporter.sendMail({
				text: 'Autenticação',
				subject: 'Confirme seu email',
				from: `Cinema <nodecinemapc2@gmail.com>`,
				to: `${professor.email}`,
				html: emailConfirmationTemplate(
					'professor',
					professor.nome,
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

module.exports = professorController;
