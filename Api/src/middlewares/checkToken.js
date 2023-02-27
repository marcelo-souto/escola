const { verify } = require("jsonwebtoken");
require("dotenv").config();

const checkToken = async (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) return res.status(401).json({ erro: "Token inválido." });

  try {
    const { diretorId, clienteId } = verify(token, process.env.PRIVATE_KEY);
    if (diretorId) req.body.diretorId = diretorId;
    if (clienteId) req.body.clienteId = clienteId;

    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido." });
  }
};

module.exports = checkToken;