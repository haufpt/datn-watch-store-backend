var express = require('express');
var router = express.Router();
const accountController = require('../../controller/auth/auth');

router.post('/login', accountController.login);

router.post('/singup', accountController.singup);

module.exports = router;
