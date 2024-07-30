const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/tokenauthentication');
const messageController = require('../controllers/messageController');

router.post('/send/:id' , authenticateToken ,messageController.sendMessages);

module.exports = router;