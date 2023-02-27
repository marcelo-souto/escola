const { Router } = require('express');
const filmeController = require('../controllers/filmeController.js');
const checkToken = require('../middlewares/checkToken.js');
const upload = require('../middlewares/upload.js');

const router = Router();

router.post('/filme/create', checkToken, upload, filmeController.create);
router.delete('/filme/delete/:filmeId', checkToken, filmeController.delete)
router.put('/filme/update', checkToken, upload, filmeController.update)

router.get('/filme/get', filmeController.getAll);
router.get('/filme/get/:filmeId', filmeController.getById);

module.exports = router;
