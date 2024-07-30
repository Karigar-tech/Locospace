const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController'); 


router.post('/createThread', threadController.createThread);


router.get('/allThreads', threadController.getAllThreads);

module.exports = router;
