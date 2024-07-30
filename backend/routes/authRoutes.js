const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signUpValidator } = require("../validators/auth-validator");
const { validateMiddleware } = require("../middlewares/validate-middleware");

router.post('/login',authController.login);

router.post('/signup',validateMiddleware(signUpValidator),authController.signUp);

module.exports = router;