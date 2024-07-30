const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/tokenauthentication');
// const {signUpValidator} = require('../validators/auth-validator');
// const {validateMiddleware} = require('../middlewares/validate-middleware');

router.post('/signup', userController.signUp);

router.get('/search',authenticateToken, userController.searchUser);

router.get('/currentChats',authenticateToken, userController.getChatters);


module.exports = router;

