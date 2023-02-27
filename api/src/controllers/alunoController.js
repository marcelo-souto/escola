const validate = require('../functions/validate.js');
const Aluno = require('../models/Aluno.js');

// nome, email, turmaId

const alunoController = {
	create: async (req, res) => {
		const { nome, email, turmaId } = req.body;

		try {
			validate({ nome, isRequired: true });
			validate({ email, type: 'email', isRequired: true });
			validate({ turmaId, type: 'numero', isRequired: true });

			const infoJaCadastrada = await Aluno.findOne({
				where: {
					email: `${email}`
				}
			});

			if (infoJaCadastrada) throw Error('Email já cadastrado.');

			const aluno = await Aluno.create({
				nome: nome,
				email: email,
				turmaId: turmaId,
				senha: `${nome}${123}`
			});

			return res
				.status(201)
				.json({ message: `Aluno ${aluno.nome} cadastrado com sucesso.` });
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	getAll: async (req, res) => {
		try {
			const alunos = await Aluno.findAll({
				attributes: {
					exclude: 'senha'
				}
			});

			return res.status(200).json(alunos);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	getById: async (req, res) => {
		const { alunoId } = req.params;
		try {
			const aluno = await Aluno.findByPk(alunoId, {
				attributes: {
					exclude: 'senha'
				}
			});
			if (!aluno)
				return res.status(404).json({ erro: 'Aluno não encontrado.' });

			return res.status(200).json(aluno);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	update: async (req, res) => {
		const { nome, email, turmaId, alunoId } = req.body;
		try {

			const aluno = await Aluno.findByPk(alunoId);
			if (!aluno) return res.status(404).json('Aluno não encontrado.');

			validate({ nome });
			validate({ email, type: 'email' });
			validate({ turma: turmaId, type: 'numero' });

			const infoJaCadastrada = await Aluno.findOne({
				where: {
					email: `${email}`
				}
			});

			if (infoJaCadastrada) throw Error('Email já cadastrado.');

			const alunoAtualizado = await aluno.update({
				nome: nome ? nome : aluno.nome,
				email: email ? email : aluno.email,
				turmaId: turmaId ? turmaId : aluno.turmaId
			});

			return res.status(200).json({
				mensagem: `Cadastro do aluno ${alunoAtualizado.nome} atualizado com sucesso.`
			});
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	delete: async (req, res) => {
		const { alunoId } = req.body;
		try {
			const aluno = await Aluno.findByPk(alunoId);
			if (!aluno) return res.status(404).json('Aluno não encontrado.');

			const alunoApagado = await aluno.destroy();
			return res
				.status(200)
				.json({
					mensagem: `Cadastro do aluno ${alunoApagado.nome} excluido com sucesso.`
				});

		} catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
	}
};

module.exports = alunoController;
