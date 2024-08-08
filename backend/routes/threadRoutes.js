const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController'); 
const authenticateToken = require('../middlewares/tokenauthentication');


router.post('/createThread', authenticateToken, threadController.createThread);

router.put('/updateThread/:id', authenticateToken, threadController.updateThread);

router.delete('/deleteThread/:id', authenticateToken, threadController.deleteThread);

router.get('/allThreads', threadController.getAllThreads);

router.get('/specificThreads/:id', authenticateToken,threadController.getSpecificThreads);

router.get('/userThreads',authenticateToken, threadController.getUserThreads);

module.exports = router;
