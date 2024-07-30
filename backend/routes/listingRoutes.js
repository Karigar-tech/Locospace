const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

//get lsitings (buy or rent)
router.get('/', listingController.getListingsByType);

router.get('/listings', getAllListings);



module.exports = router;
