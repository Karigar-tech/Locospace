const express = require('express');
const router = express.Router();
const multer = require('multer');
const listingController = require('../controllers/sellerController');
const authenticateToken = require('../middlewares/tokenauthentication');

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new listing
router.post('/', authenticateToken, upload.array('ListingPictures', 5), listingController.createListing);

// Edit a listing
router.put('/:id', authenticateToken, upload.array('ListingPictures', 5), listingController.editListing);

// Delete a listing
router.delete('/:id', authenticateToken, listingController.deleteListing);


module.exports = router;
