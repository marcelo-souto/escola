const { Router } = require('express');
const salaController = require('../controllers/salaController.js');
const checkToken = require('../middlewares/checkToken.js');

const router = Router();

router.post('/sala/create', checkToken, salaController.create);
router.put('/sala/update', checkToken, salaController.update);
router.delete('/sala/delete/:salaId', checkToken, salaController.delete);

router.get('/sala/get', salaController.getAll);
router.get('/sala/get/:salaId', salaController.getById);

module.exports = router;

module.exports = router;