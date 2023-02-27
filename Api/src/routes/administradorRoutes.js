const { Router } = require('express');
const checkToken = require('../middlewares/checkToken.js');
const administradorController = require('../controllers/administradorController.js');

const router = Router();

router.post('/admin/create', administradorController.create);
router.post('/admin/auth', administradorController.auth);
router.get('/admin/get', checkToken, administradorController.getInfo);
router.put('/admin/update', checkToken, administradorController.update);
router.delete('/admin/delete', checkToken, administradorController.delete)
router.get('/admin/att/:token', administradorController.getAutenticate)
router.post('/admin/resetpassword', administradorController.resetPassword)
router.post('/admin/changepassword', checkToken, administradorController.changePassword)
router.post('/admin/resendemail', administradorController.resendVerificationEmail)

module.exports = router;
