const express = require('express');
const router = express.Router(); // Create a new router instance
const authController = require('../controllers/authController'); // Import the auth controller
const { signUpValidator, loginValidator } = require('../validators/auth-validator'); // Import validators for signup and login
const { validateMiddleware } = require('../middlewares/validate-middleware'); // Import validation middleware

// Route for user login
// Validates the request body using loginValidator before calling authController.login
router.post('/login', validateMiddleware(loginValidator), authController.login);

// Route for user signup
// Validates the request body using signUpValidator before calling authController.signUp
router.post('/signup', validateMiddleware(signUpValidator), authController.signUp);


// In authRoutes.js
router.post('/reset-password', authController.resetPassword);


module.exports = router; // Export the router
