const { Router } = require('express')
const turmaController = require('../controllers/turmaController.js')
const checkToken = require("../middlewares/checkToken.js");

const router = Router()

router.post('/turma/create', checkToken, turmaController.create)
router.put('/turma/update', checkToken, turmaController.update)
router.get('/turma/getbyid',  checkToken, turmaController.getbyid)
router.delete('/turma/delete',  checkToken, turmaController.delete)

module.exports = router