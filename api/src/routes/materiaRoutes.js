const { Router } = require('express')
const materiaController = require('../controllers/materiaController.js')

const router = Router()

router.post('/materia/create', materiaController.create)
router.put('/materia/update', materiaController.update)
router.get('/materia/get', materiaController.get)
router.delete('/materia/delete', materiaController.delete)


module.exports = router