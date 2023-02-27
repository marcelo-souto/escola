const { Router } = require('express')
const turmaController = require('../controllers/turmaController.js')

const router = Router()

router.post('/ano/create', turmaController.create)
router.put('/ano/atualization', turmaController.update)
router.get('/ano/getall', turmaController.getAll)
router.delete('/ano/delete', turmaController.delete)


module.exports = router