const Sessao = require('../models/Sessao.js');
const Filme = require('../models/Filme.js');
const Sala = require('../models/Sala.js');
const Assento = require('../models/Assento.js');
const Administrador = require('../models/Administrador.js');
const Dia = require('../models/Dia.js');
const timeConvert = require('../functions/timeConvert.js');
require('dotenv').config();

const { Op } = require('sequelize');

const validate = require('../functions/validate.js');
const Genero = require('../models/Genero.js');

const sessaoController = {
	getById: async (req, res) => {
		const { sessaoId } = req.params;

		try {
			const sessao = await Sessao.findByPk(sessaoId, {
				attributes: { exclude: ['salaId', 'administradorId'] },
				include: [
					{
						model: Filme,
						attributes: {
							exclude: ['administradorId', 'generoId']
						},
						include: {
							model: Genero
						}
					},
					{
						model: Sala
					},
					{
						model: Assento
					},
					{
						model: Dia
					}
				]
			});

			if (!sessao)
				return res.status(404).json({ erro: 'Sessão não encontrada.' });

			return res.status(200).json(sessao);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},
	getAll: async (req, res) => {
		let queries;

		if (req.url.includes('include'))
			queries = req.url.replaceAll('include=', '').split('?')[1].split('&');

		const includesQuery = {
			sala: {
				model: Sala,
				as: 'sala'
			},
			filme: {
				model: Filme,
				as: 'filme'
			}
		};

		try {
			const sessao = await Sessao.findAll({
				include: queries && queries.filter((query) => includesQuery[query])
			});

			return res.status(200).json(sessao);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	},

	create: async (req, res) => {
		const { administradorId, dia, horas, sala, preco, filme } = req.body;

		try {
			const findAdministrador = await Administrador.findByPk(administradorId);
			if (!findAdministrador)
				throw new Error('Usuario não tem autorização para essa área');

			// validate({ 'id do dia': dia, type: 'numero', isRequired: true });
			validate({
				'duração em horas': horas.hora,
				type: 'numero',
				isRequired: true
			});
			validate({
				'duração em minutos': horas.minuto,
				type: 'numero',
				isRequired: true
			});
			validate({ 'Id da sala': sala, type: 'numero', isRequired: true });
			validate({ 'Valor da sessão': preco, type: 'numero', isRequired: true });
			validate({ 'Id do filme': filme, type: 'numero', isRequired: true });

			const findDia = await Dia.findByPk(dia);
			if (!findDia) throw new Error('Data não encontrada;');

			const findSala = await Sala.findByPk(sala);
			if (!findSala) throw new Error('Sala não encontrada;');

			const findFilme = await Filme.findByPk(filme);
			if (!findFilme) throw new Error('Filme não encontrada;');

			const sessaoHoraInicio = horas.hora;
			const sessaoMinutoInicio = horas.minuto;

			const tempoFilme = (findFilme.duracaoMinutos / 60).toFixed(2);
			const horaEminuto = String(tempoFilme).split('.');

			let sessaoHoraTermino = sessaoHoraInicio + parseInt(horaEminuto[0]);
			let sessaoMinutoTermino = sessaoMinutoInicio + parseInt(horaEminuto[1]);

			let InicioHorarioEmMinutos = sessaoHoraInicio * 60 + sessaoMinutoInicio;
			let TerminoHorarioEmMinutos =
				sessaoHoraTermino * 60 + sessaoMinutoTermino;

			const sessaoHoras = await Sessao.findOne({
				where: {
					salaId: sala,
					[Op.or]: {
						inicioMinuto: {
							[Op.between]: [InicioHorarioEmMinutos, TerminoHorarioEmMinutos]
						},
						terminoMinuto: {
							[Op.between]: [InicioHorarioEmMinutos, TerminoHorarioEmMinutos]
						}
					}
				},
				include: [
					{
						model: Filme
					}
				]
			});

			if (sessaoHoras)
				return res
					.status(200)
					.json(
						`A duração da sessão de ${timeConvert(
							InicioHorarioEmMinutos
						)} até ${timeConvert(
							TerminoHorarioEmMinutos
						)} está em comflitos com as horas do filme ${
							sessaoHoras.filme.nome
						}, cujo a Sessao será de ${timeConvert(
							sessaoHoras.inicioMinuto
						)} até ${timeConvert(sessaoHoras.terminoMinuto)}`
					);

			const sessao = await Sessao.create({
				filmeId: filme,
				salaId: sala,
				administradorId: administradorId,
				preco: preco,
				diaId: dia,

				inicioMinuto: InicioHorarioEmMinutos,
				terminoMinuto: TerminoHorarioEmMinutos
			});

			return res.status(200).json(sessao);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	},

	update: async (req, res) => {
		const { administradorId, sessaoId, dia, horas, sala, preco, filme } =
			req.body;

		try {
			const findAdministrador = await Administrador.findByPk(administradorId);
			if (!findAdministrador)
				throw new Error('Usuario não tem altorização para essa área');

			const findSessao = await Sessao.findByPk(sessaoId);
			if (!findSessao) throw new Error('Sessão não encontrada ou não existe');

			validate({ 'id do dia': dia, type: 'numero', isRequired: true });
			validate({
				'duração em horas': horas.hora,
				type: 'numero',
				isRequired: true
			});
			validate({
				'duração em minutos': horas.minuto,
				type: 'numero',
				isRequired: true
			});
			validate({ 'Id da sala': sala, type: 'numero', isRequired: true });
			validate({ 'Valor da sessão': preco, type: 'numero', isRequired: true });
			validate({ 'Id do filme': filme, type: 'numero', isRequired: true });

			const findDia = await Dia.findByPk(dia);
			if (!findDia) throw new Error('Data não encontrada;');

			const findSala = await Sala.findByPk(sala);
			if (!findSala) throw new Error('Sala não encontrada;');

			const findFilme = await Filme.findByPk(filme);
			if (!findFilme) throw new Error('Filme não encontrada;');

			const sessaoHoraInicio = horas.hora;
			const sessaoMinutoInicio = horas.minuto;

			const tempoFilme = (findFilme.duracaoMinutos / 60).toFixed(2);
			const horaEminuto = String(tempoFilme).split('.');

			let sessaoHoraTermino = sessaoHoraInicio + parseInt(horaEminuto[0]);
			let sessaoMinutoTermino = sessaoMinutoInicio + parseInt(horaEminuto[1]);

			let InicioHorarioEmMinutos = sessaoHoraInicio * 60 + sessaoMinutoInicio;
			let TerminoHorarioEmMinutos =
				sessaoHoraTermino * 60 + sessaoMinutoTermino;

			const sessaoHoras = await Sessao.findOne({
				where: {
					salaId: sala,
					[Op.or]: {
						inicioMinuto: {
							[Op.between]: [InicioHorarioEmMinutos, TerminoHorarioEmMinutos]
						},
						terminoMinuto: {
							[Op.between]: [InicioHorarioEmMinutos, TerminoHorarioEmMinutos]
						}
					}
				},
				include: [
					{
						model: Filme
					}
				]
			});

			if (sessaoHoras)
				return res
					.status(200)
					.json(
						`A duração da sessão de ${timeConvert(
							InicioHorarioEmMinutos
						)} até ${timeConvert(
							TerminoHorarioEmMinutos
						)} está em comflitos com as horas do filme ${
							sessaoHoras.filme.nome
						}, cujo a Sessao será de ${timeConvert(
							sessaoHoras.inicioMinuto
						)} até ${timeConvert(sessaoHoras.terminoMinuto)}`
					);

			const SessaoAtualizada = await findSessao.update({
				filmeId: filme,
				salaId: sala,
				administradorId: administradorId,
				preco: preco,

				inicioMinuto: InicioHorarioEmMinutos,
				terminoMinuto: TerminoHorarioEmMinutos
			});

			return res
				.status(200)
				.json(` A sessão foi atualizada:${SessaoAtualizada}`);
		} catch (erro) {
			return res.json({ erro: erro.message });
		}
	},

	delete: async (req, res) => {
		const { sessaoId } = req.params;

		try {
			const sessao = await Sessao.findByPk(sessaoId);
			if (!sessao)
				return res.status(404).json({ erro: 'Sessao não encontrada.' });

			const sessaoDeletada = await sessao.destroy();
			return res.status(200).json({
				mensagem: `Sessão numero ${sessaoDeletada.sessaoId} excluida com sucesso.`
			});
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	}
};

module.exports = sessaoController;
