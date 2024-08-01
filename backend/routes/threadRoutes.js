const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController'); 
const authenticateToken = require('../middlewares/tokenauthentication');


router.post('/createThread', authenticateToken, threadController.createThread);


router.get('/allThreads', threadController.getAllThreads);

module.exports = router;
