const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');
const authenticateToken = require('../middlewares/tokenauthentication');

// Define the route for creating a reply
router.post('/createReply', authenticateToken, replyController.createReply);

// Define the route for fetching replies by thread ID
router.get('/thread/:thread_id', authenticateToken,replyController.getRepliesByThread);

// // Define the route for updating a reply
// router.put('/updateReply/:id', authenticateToken, replyController.updateReply);

// // Define the route for deleting a reply
// router.delete('/deleteReply/:id', authenticateToken, replyController.deleteReply);

module.exports = router;
