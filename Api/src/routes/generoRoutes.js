const { Router } = require('express');
const generoController = require('../controllers/generoController.js');
const checkToken = require('../middlewares/checkToken.js');

const router = Router();

// Rotas Protegidas
router.post('/genero/create', checkToken, generoController.create);
router.put('/genero/update', checkToken, generoController.update);
router.delete('/genero/delete/:generoId', checkToken, generoController.delete);

// Rotas liberadas
router.get('/genero/get/:generoId', generoController.getById);
router.get('/genero/get', generoController.getAll);

module.exports = router;

module.exports = router;