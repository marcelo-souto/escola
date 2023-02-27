const { Router } = require('express')
const diaController = require('../controllers/diaController.js')

const router = Router()

router.post('/dia/create', diaController.create)

module.exports = router