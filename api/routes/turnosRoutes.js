const { Router } = require('express')
const turnoController = require('../controllers/turnoController.js')
const checkToken = require("../middlewares/checkToken.js");

const router = Router()

router.post('/turno/create', checkToken, turnoController.create)
router.put('/turno/update', checkToken, turnoController.update)
router.get('/turno/get', turnoController.get)
router.delete('/turno/delete', checkToken, turnoController.delete)


module.exports = router