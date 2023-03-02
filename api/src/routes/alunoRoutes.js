const { Router } = require('express');
const alunoController = require('../controllers/alunoController.js');
const checkToken = require('../middlewares/checkToken.js');

const route = Router();

route.get('/aluno/get', checkToken, alunoController.getAll);
route.get('/aluno/get/:alunoId', checkToken, alunoController.getById);

route.post('/aluno/create', checkToken, alunoController.create);
route.put('/aluno/update', checkToken, alunoController.update);
route.delete('/aluno/delete', checkToken, alunoController.delete);

module.exports = route;
