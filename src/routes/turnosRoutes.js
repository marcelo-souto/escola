const { Router } = require('express')
const turnoController = require('../controllers/turnoController.js')

const router = Router()

router.post('/ano/create', turnoController.create)
router.put('/ano/atualization', turnoController.update)
router.get('/ano/getall', turnoController.getAll)
router.delete('/ano/delete', turnoController.delete)


module.exports = router