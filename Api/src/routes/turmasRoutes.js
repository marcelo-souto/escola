const { Router } = require('express')
const turmaController = require('../controllers/turmaController.js')

const router = Router()

router.post('/turma/create', turmaController.create)
router.put('/turma/atualization', turmaController.update)
router.get('/turma/getall', turmaController.getAll)
router.delete('/turma/delete', turmaController.delete)

module.exports = router