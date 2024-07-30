const express = require('express');
const router = express.Router();
const threadController = require("../controllers/threadController"); // Adjust the path as needed

// Create a new thread
router.post('/createThread', threadController.createThread);

// Get all threads
router.get('/allThreads', threadController.getAllThreads);

module.exports = router;
