const { Router } = require('express')
const checkToken = require('../middlewares/checkToken')
const clienteController = require('../controllers/clienteController.js')

const router = Router()

router.get('/cliente/att/:token', clienteController.getAutenticate)
router.post('/cliente/auth', clienteController.auth)
router.post('/cliente/create', clienteController.post)

router.get('/cliente/get', checkToken, clienteController.getInfo)
router.put('/cliente/update', checkToken, clienteController.update)
router.delete('/cliente/delete', checkToken, clienteController.delete)
router.post('/cliente/resetpassword', clienteController.resetPassword)
router.post('/cliente/changepassword', checkToken, clienteController.changePassword)
router.post('/cliente/resendemail', clienteController.resendVerificationEmail)

module.exports = router