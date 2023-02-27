const Materia = require("../models/Materia.js");

const materiaController = {
  create: async (req, res) => {
    const { diretorId, nome } = req.body;

    try {
      const materiaExiste = await Materia.findOne({ where: { nome: nome } });
      if (materiaExiste) throw new Error("Materia ja cadastrada.");

      const materia = await Materia.create({
        nome: nome,
        diretorId: diretorId,
      });

      return res.status(200).json(materia);
    } catch (erro) {
      return res.json({ erro: erro.message });
    }
  },

  get: async (req, res) => {
    const { materiaId } = req.body;

    try {
      const materia = await Materia.findAll();
      if (!materia) throw new Error("Materia não cadastrada -.");

      return res.status(200).json(materia);
    } catch (erro) {
      return res.json({ erro: erro.message });
    }
  },

  update: async (req, res) => {
    const { materiaId, nome } = req.body;

    try {
      const materiaExiste = await Materia.findOne({
        where: { materiaId: materiaId },
      });
      if (!materiaExiste) throw new Error("Materia não cadastrada.");

      const materia = await materiaExiste.update({
        nome: nome,
      });

      return res.status(200).json(materia);
    } catch (erro) {
      return res.json({ erro: erro.message });
    }
  },

  delete: async (req, res) => {
    const { materiaId } = req.body;

    try {
      const materiaExiste = await Materia.findByPk(materiaId);
      if (!materiaExiste) throw new Error("Materia não cadastrada.");

      const materia = await materiaExiste.destroy();

      return res.status(200).json("Matéria " + materia + "deletada com sucesso");
    } catch (erro) {
      return res.json({ erro: erro.message });
    }
  },
};

module.exports = materiaController;
