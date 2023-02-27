const { Router } = require('express')
const anoController = require('../controllers/anoController.js')

const router = Router()

router.post('/ano/create', anoController.create)
router.put('/ano/update', anoController.update)
router.get('/ano/get', anoController.getAll)
router.delete('/ano/delete', anoController.delete)


module.exports = router