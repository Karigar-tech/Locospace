// backend/routes/threadRoutes.js

const express = require('express');
const router = express.Router();
const { createThread } = require('../controllers/threadController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Route to create a new thread
router.post('/create', authMiddleware, createThread);

module.exports = router;
