const Listing = require('../models/listingModel');
const Community = require('../models/communityModel');


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


exports.getAllListings = async (req, res) => {
    const { environment, facilities, ageGroup, search, community } = req.query;
  
    try {
      // Fetch all listings
      let listings = await Listing.find();
  
      // Apply search filter
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        listings = listings.filter(listing =>
          listing.title.match(searchRegex) ||
          listing.description.match(searchRegex) ||
          listing.location.match(searchRegex)
        );
      }
  
      // Apply environment filter
      if (environment) {
        listings = listings.filter(listing =>
          listing.preferences &&
          listing.preferences.environment &&
          listing.preferences.environment.some(env => environment.split(',').includes(env))
        );
      }
  
      // Apply facilities filter
      if (facilities) {
        listings = listings.filter(listing =>
          listing.preferences &&
          listing.preferences.facilities &&
          listing.preferences.facilities.some(facility => facilities.split(',').includes(facility))
        );
      }
  
      // Apply age group filter
      if (ageGroup) {
        listings = listings.filter(listing =>
          listing.preferences &&
          listing.preferences.ageGroup &&
          listing.preferences.ageGroup.some(age => ageGroup.split(',').includes(age))
        );
      }
  
      // Apply community filter
      if (community) {
        const communityRegex = new RegExp(community, 'i');
        const matchingCommunities = await Community.find({ communityName: { $regex: communityRegex } });
        const matchingCommunityIds = matchingCommunities.map(comm => comm._id.toString());
  
        listings = listings.filter(listing =>
          listing.community && matchingCommunityIds.includes(listing.community.toString())
        );
      }
  
      res.status(200).json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ message: 'Error fetching listings', error });
    }
  };