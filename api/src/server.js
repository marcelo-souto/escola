const express = require('express');
const cors = require('cors')
const logger = require('./functions/logger.js');
const path = require('path');
require('dotenv').config();

const anoRoutes = require('./routes/anoRoutes.js');
const turnosRoutes = require('./routes/turnosRoutes.js');
const turmasRoutes = require('./routes/turmasRoutes.js');
const tokenRouts = require('./routes/tokenRoutes.js')
const diretorRoutes = require('./routes/diretorRoutes.js')
const materiaRoutes = require('./routes/materiaRoutes')
const professorRoutes = require('./routes/professorRoutes')

// Variaveis
const port = process.env.PORT;
const server = express();

// Middlewares
server.use(cors())
server.use(express.json());
server.use(logger);

// Rotas
server.use('/', anoRoutes);
server.use('/', turnosRoutes);
server.use('/', turmasRoutes);
server.use('/', materiaRoutes)
server.use('/', tokenRouts);
server.use('/', diretorRoutes);
server.use('/', professorRoutes)


server.get('/', (req, res) => {
	return res.send('<h1>Servidor rodando ...<h1>');
});

server.listen(port, () => {
	console.log(`Servidor rodando na porta ${port} ...`);
});
