const express = require('express');
const router = express.Router();
const multer = require('multer');
const communtiyController = require('../controllers/communityController');
const authenticateToken = require('../middlewares/tokenauthentication');

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create', upload.single('communityPicture'), communtiyController.createCommunity);

router.get('/',authenticateToken, communtiyController.getAllCommunities )

router.get('/:name', authenticateToken, communtiyController.getCommunityDetails);

router.get('/commID/:community_id', authenticateToken, communtiyController.getName);

module.exports = router;