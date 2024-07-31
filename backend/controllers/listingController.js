const Listing = require('../models/listingModel');
const User = require('../models/userModel');
const { bucket } = require('../firebaseAdmin');


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

const generatePublicUrl = (file) => {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
};

exports.createListing = async (req, res) => {
  try {
      const userId = req.user.id;

      //check for 2 listings
      const existingListingsCount = await Listing.countDocuments({ user_id: userId });
      if (existingListingsCount >= 2) {
          return res.status(403).json({ error: "You can only create up to 2 listings." });
      }

      const listingData = {
          user_id: req.user.id,
          title: req.body.title,
          listing_type: req.body.listing_type,
          price: req.body.price,
          Description: req.body.Description,
          location: req.body.location,
          bedroom: req.body.bedroom,
          bath: req.body.bath,
          kitchen: req.body.kitchen,
          area: req.body.area,
          preferences: req.body.preferences,
      };

      if (req.files) {
          // Upload images to Firebase Storage
          const uploadPromises = req.files.map(async (file) => {
              const blob = bucket.file(`listings/${Date.now()}_${file.originalname}`);
              const blobStream = blob.createWriteStream({
                  metadata: {
                      contentType: file.mimetype
                  }
              });

              return new Promise((resolve, reject) => {
                  blobStream.on('error', reject);
                  blobStream.on('finish', async () => {
                      try {
                          const publicUrl = generatePublicUrl(blob);
                          resolve(publicUrl);
                      } catch (error) {
                          reject(error);
                      }
                  });
                  blobStream.end(file.buffer);
              });
          });

          const imageUrls = await Promise.all(uploadPromises);
          listingData.ListingPictures = imageUrls;
      }

      const listing = new Listing(listingData);
      await listing.save();
      res.status(201).json({ ...listing._doc, listing_id: listing._id });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

exports.editListing = async (req, res) => {
  try {
      const updateData = {
          listing_type: req.body.listing_type,
          price: req.body.price,
          Description: req.body.Description,
          location: req.body.location,
          bedroom: req.body.bedroom,
          bath: req.body.bath,
          kitchen: req.body.kitchen,
          area: req.body.area,
          preferences: req.body.preferences,
      };

      if (req.files) {
          // Upload images to Firebase Storage
          const uploadPromises = req.files.map(async (file) => {
              const blob = bucket.file(`listings/${Date.now()}_${file.originalname}`);
              const blobStream = blob.createWriteStream({
                  metadata: {
                      contentType: file.mimetype
                  }
              });

              return new Promise((resolve, reject) => {
                  blobStream.on('error', reject);
                  blobStream.on('finish', async () => {
                      try {
                          const publicUrl = generatePublicUrl(blob);
                          resolve(publicUrl);
                      } catch (error) {
                          reject(error);
                      }
                  });
                  blobStream.end(file.buffer);
              });
          });

          const imageUrls = await Promise.all(uploadPromises);
          updateData.ListingPictures = imageUrls;
      }

      const listing = await Listing.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!listing) {
          return res.status(404).json({ error: 'Listing not found' });
      }
      res.status(200).json({ ...listing._doc, listing_id: listing._id });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
      const listing = await Listing.findByIdAndDelete(req.params.id);
      if (!listing) {
          return res.status(404).json({ error: 'Listing not found' });
      }

      // Optionally delete images from Firebase Storage
      if (listing.ListingPictures) {
          const deletePromises = listing.ListingPictures.map(async (url) => {
              const filePath = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
              const file = bucket.file(filePath);
              return file.delete();
          });

          await Promise.all(deletePromises);
      }

      res.status(200).json({ message: 'Listing deleted successfully', listing_id: listing._id });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

exports.getListings = async (req, res) => {
  try {
      const listings = await Listing.find(); 

      if (!listings || listings.length === 0) {
          return res.status(404).json({ message: 'No listings found' });
      }

      const response = listings.map(listing => {
          return {
              ...listing._doc, 
              ListingPictures: listing.ListingPictures 
          };
      });

      res.status(200).json(response);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

exports.getSpecificListing = async (req, res) => {
  try {
      // Fetch the listing by ID
      const listing = await Listing.findById(req.params.id).exec();
      if (!listing) {
          return res.status(404).json({ error: 'Listing not found' });
      }

      // Fetch the user associated with the listing
      const user = await User.findById(listing.user_id).exec();
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Construct the response with conditional profilePicture
      const response = {
          ...listing.toObject(), // Include listing data
          user: {
              ...user.toObject(), // Include user data
              profilePicture: user.profilePicture || null // Set profilePicture to null if it doesn't exist
          }
      };

      res.status(200).json(response);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

exports.getAllListings = async (req, res) => {
    const { environment, facilities, ageGroup, search, community } = req.query;
  
    try {
      let listings = [];
  
      if (community) {
        // If a community is selected, get its listings
        const communityRegex = new RegExp(community, 'i');
        const matchingCommunities = await Community.find({ communityName: { $regex: communityRegex } });
  
        if (matchingCommunities.length > 0) {
          const matchingCommunityIds = matchingCommunities.map(comm => comm._id.toString());
  
          // Find all listings that belong to the matching communities
          listings = await Listing.find({ community: { $in: matchingCommunityIds } });
        }
      } else {
        // Fetch all listings if no community is selected
        listings = await Listing.find();
      }
  
      // Apply search term filter
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        listings = listings.filter(listing =>
          listing.title.match(searchRegex) ||
          listing.description.match(searchRegex) ||
          listing.location.match(searchRegex) ||
          (listing.preferences &&
            (listing.preferences.environment && listing.preferences.environment.some(env => searchRegex.test(env))) ||
            (listing.preferences.facilities && listing.preferences.facilities.some(facility => searchRegex.test(facility))) ||
            (listing.preferences.ageGroup && listing.preferences.ageGroup.some(age => searchRegex.test(age))))
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
  
      // Apply ageGroup filter
      if (ageGroup) {
        listings = listings.filter(listing =>
          listing.preferences &&
          listing.preferences.ageGroup &&
          listing.preferences.ageGroup.some(age => ageGroup.split(',').includes(age))
        );
      }
  
      res.status(200).json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ message: 'Error fetching listings', error });
    }
  };
  