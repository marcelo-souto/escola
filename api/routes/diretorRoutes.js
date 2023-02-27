const { Router } = require('express')
const diretorController = require('../controllers/diretorController.js')
const checkToken = require('../middlewares/checkToken.js');

const router = Router()

router.post('/diretor/create', diretorController.create)
router.get('/diretor/att/:token', diretorController.getAutenticate)
router.post('/diretor/auth', diretorController.auth)
router.put('/diretor/atualization', checkToken, diretorController.update)
router.get('/diretor/get', checkToken, diretorController.getInfo)
router.delete('/diretor/delete', checkToken, diretorController.delete)
router.post('/diretor/resetpassword', diretorController.resetPassword)
router.post('/diretor/changepassword', checkToken, diretorController.changePassword)
router.post('/diretor/resendemail', diretorController.resendVerificationEmail)


module.exports = router