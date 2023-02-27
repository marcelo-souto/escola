const { Router } = require('express')
const materiaController = require('../controllers/materiaController.js')
const checkToken = require('../middlewares/checkToken.js')

const router = Router()

router.post('/materia/create', checkToken, materiaController.create)
// router.put('/ano/atualization', anoController.update)
// router.get('/ano/getall', anoController.getAll)
// router.delete('/ano/delete', anoController.delete)


module.exports = router