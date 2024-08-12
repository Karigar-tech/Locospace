const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const authenticateToken = require('../middlewares/tokenauthentication');
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });




router.get('/specific/:id', listingController.getSpecificListing)

router.get('/alllistings', listingController.getListings); 

router.get('/nearby',listingController.getNearbyListings)

router.get('/type', listingController.getListingsByType);

router.get('/listingsearch', listingController.getAllListings);

router.post('/savedListings', authenticateToken, listingController.addSavedListing);

router.post('/unsavedListings', authenticateToken, listingController.removeSavedListing);

router.post('/', authenticateToken, upload.array('ListingPictures', 5), listingController.createListing);

router.put('/:id', authenticateToken, upload.array('ListingPictures', 5), listingController.editListing);


router.delete('/:id', authenticateToken, listingController.deleteListing);

module.exports = router;
