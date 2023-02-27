const express = require('express');
const cors = require('cors')
const logger = require('./functions/logger.js');
const path = require('path');
require('dotenv').config();

const administradorRoutes = require('./routes/administradorRoutes.js');
const clienteRoutes = require('./routes/clienteRoutes.js');
const filmeRoutes = require('./routes/filmeRoutes.js');
const generoRoutes = require('./routes/generoRoutes.js');
const salaRoutes = require('./routes/salaRoutes.js');
const diaRoutes = require('./routes/diaRoutes.js');
const sessaoRoutes = require('./routes/sessaoRoutes.js')
const tokenRoutes = require('./routes/tokenRoutes.js')

// Variaveis
const port = process.env.PORT;
const server = express();

// Middlewares
server.use(express.static(path.join(__dirname, '../public')));
server.use(cors())
server.use(express.json());
server.use(logger);

// Rotas
server.use('/', administradorRoutes);
server.use('/', clienteRoutes);
server.use('/', filmeRoutes);
server.use('/', generoRoutes);
server.use('/', salaRoutes);
server.use('/', diaRoutes);
server.use('/', sessaoRoutes);
server.use('/', tokenRoutes)

server.get('/', (req, res) => {
	return res.send('<h1>Servidor rodando ...<h1>');
});

server.listen(port, () => {
	console.log(`Servidor rodando na porta ${port} ...`);
});
