const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const authenticateToken = require('../middlewares/tokenauthentication');

router.post('/login',loginController.login);

module.exports = router;