const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {signUpValidator} = require('../validators/auth-validator');
const {validateMiddleware} = require('../middlewares/validate-middleware');

router.post('/signup',userController.signUp);


module.exports = router;

