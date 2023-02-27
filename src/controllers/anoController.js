const Ano = require("../models/Ano.js");
const { Op } = require("sequelize");
const validate = require("../functions/validate.js");
const nodemailer = require("nodemailer");
const { hash, compare } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");

const anoController = {
  create: async (req, res) => {
    const { anoLetivo, diretorId: id } = req.body;

    try {
      const findAno = await Ano.findOne({ where: { anoLetivo: anoLetivo } });
      if (findAno) throw new Error("Ano letivo já existe");

      const ano = await Ano.create({
        anoLetivo: anoLetivo,
        diretorId: id,
      });

      return res.status(200).json(`Ano criada com sucesso: ${ano.anoLetivo}`);
    } catch (erro) {
      return res.json({ erro: erro.message });
    }
  },

  update: async (req, res) => {
    const { diretorId: id, anoId, anoLetivo } = req.body;

    try {
      const ano = await Ano.findByPk(anoId);
      console.log(ano.anoId, id)
      if (ano.diretorId != id)throw new Error(`Diretor não possuiur acesso a esse dado.`);
      
      const anoAtt = await ano.update({
        anoLetivo: anoLetivo,
      });

      return res.status(200).json(`Ano criada com sucesso: ${ano.anoLetivo}`);
    } catch (erro) {
      return res.json({ erro: erro.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const ano = await Ano.findAll();

      return res.status(200).json(ano);
    } catch (erro) {
      return res.json({ erro: erro.message });
    }
  },

  delete: async (req, res) => {
    const { diretorId: id, anoId } = req.body;

    try {
      const ano = await Ano.findOne(anoId);
      if (ano.anoId != anoId)throw new Error(`Diretor não possuiur acesso a esse dado.`);
      const anoDestroy = await ano.destroy();

      return res.status(200).json(`Ano deletado com sucesso: ${ano}`);
    } catch (erro) {
      return res.json({ erro: erro.message });
    }
  },
};

module.exports = anoController;
