
const { Router } = require('express');
const tokenController = require('../controllers/tokenController.js');

const router = Router()

router.post('/token/validate', tokenController.validate)

module.exports = router