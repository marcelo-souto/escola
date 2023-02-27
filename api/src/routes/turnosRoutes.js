const { Router } = require('express')
const turnoController = require('../controllers/turnoController.js')

const router = Router()

router.post('/turno/create', turnoController.create)
router.put('/turno/update', turnoController.update)
router.get('/turno/get', turnoController.get)
router.delete('/turno/delete', turnoController.delete)


module.exports = router