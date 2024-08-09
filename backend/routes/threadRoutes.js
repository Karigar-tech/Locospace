const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController'); 
const authenticateToken = require('../middlewares/tokenauthentication');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 20 * 1024 * 1024, 
      fieldSize: 20 * 1024 * 1024,
      files: 2, 
    },
  });

router.post('/createThread', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'document', maxCount: 1 }]), threadController.createThread);

router.put('/updateThread/:id', authenticateToken, threadController.updateThread);

router.delete('/deleteThread/:id', authenticateToken, threadController.deleteThread);

router.get('/allThreads', threadController.getAllThreads);

router.get('/specificThreads/:id', authenticateToken,threadController.getSpecificThreads);

router.get('/userThreads',authenticateToken, threadController.getUserThreads);

module.exports = router;
