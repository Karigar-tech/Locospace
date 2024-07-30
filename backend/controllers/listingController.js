const Listing = require('../models/listingModel');


exports.getListingsByType = async (req, res) =>{
    const { keyword } = req.query;

  if (!keyword || (keyword !== 'buy' && keyword !== 'rent')) {
    return res.status(400).json({ message: 'Invalid keyword. It must be either "buy" or "rent".' });
  }

  const listingType = keyword === 'buy' ? 'Sell' : 'Rent';

  try {
    const listings = await Listing.find({ listing_type: listingType });
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Error fetching listings', error });
  }
}