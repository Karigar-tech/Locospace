const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const authenticateToken = require('../middlewares/tokenauthentication');
const multer = require('multer');


// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Create a new listing
router.post('/', authenticateToken, upload.array('ListingPictures', 5), listingController.createListing);

// Edit a listing
router.put('/:id', authenticateToken, upload.array('ListingPictures', 5), listingController.editListing);

// Delete a listing
router.delete('/:id', authenticateToken, listingController.deleteListing);


// get a specific listing
router.get('/specific/:id', listingController.getSpecificListing)

// Get all listings
router.get('/all', listingController.getListings); 

// Get listings by type
router.get('/', listingController.getListingsByType);

router.get('/listings', getAllListings);



module.exports = router;
