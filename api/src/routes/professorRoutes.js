const { Router } = require('express');
const professorController = require('../controllers/professorController.js');
const checkToken = require('../middlewares/checkToken');

const route = Router();

route.post('/professor/create', checkToken, professorController.create);
route.get('/professor/att/:token', professorController.getAutenticate);
route.post('/professor/auth', professorController.auth);
route.get('/professor/get', checkToken, professorController.getInfo)
route.put('/professor/update', checkToken, professorController.update)
route.delete('/professor/delete', checkToken, professorController.delete)

route.post('/professor/resetpassword', professorController.resetPassword)
route.post('/professor/changepassword', checkToken, professorController.changePassword)
route.post('/professor/resendemail', professorController.resendVerificationEmail)

module.exports = route;
