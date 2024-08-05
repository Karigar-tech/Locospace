const Listing = require('../models/listingModel');
const User = require('../models/userModel');
const Community = require('../models/communityModel')
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
          return res.status(403).json({ message: "You can only create up to 2 listings." });
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
          community: req.body.community
      };

      if (req.files) {
          //uploading images to Firebase Storage
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
      res.status(201).json({
        message: 'Listing created successfully',
        listing_id: listing._id,
        ...listing._doc,
      });
  } catch (error) {
        console.error('Error creating listing:', error);
      res.status(500).json({ message: 'An error occurred while creating the listing.' });
  }
};

exports.editListing = async (req, res) => {
  try {
      const updateData = {
          listing_type: req.body.listing_type,
          price: req.body.price,
          numberOfStories: req.body.numberOfStories,
          Description: req.body.Description,
          location: req.body.location,
          bedroom: req.body.bedroom,
          bath: req.body.bath,
          kitchen: req.body.kitchen,
          area: req.body.area,
          preferences: req.body.preferences,
      };

      if (req.files) {
         
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
     
      const listing = await Listing.findById(req.params.id).exec();
      if (!listing) {
          return res.status(404).json({ error: 'Listing not found' });
      }

      
      const user = await User.findById(listing.user_id).exec();
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const response = {
          ...listing.toObject(), 
          user: {
              ...user.toObject(), 
              profilePicture: user.profilePicture || null 
          }
      };

      res.status(200).json(response);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

exports.getAllListings = async (req, res) => {
  const { environment, facilities, ageGroup, search, community } = req.query;
  console.log('Listings search:', req.query);

  try {
      let query = {};

   
      if (community) {
         
          if (!['DHA-1', 'DHA-2', 'Bahria Phase 1-6', 'Bahria Phase 7-9', 'Gulberg Greens', 'PWD'].includes(community)) {
              return res.status(400).json({ message: 'Invalid community value' });
          }
          query.community = community;
      }

      let listings = await Listing.find(query);


      if (search) {
          const searchRegex = new RegExp(search, 'i');
          listings = listings.filter(listing =>
              searchRegex.test(listing.title) ||
              searchRegex.test(listing.Description) ||
              searchRegex.test(listing.location) ||
              (listing.preferences &&
                  (listing.preferences.environment && listing.preferences.environment.some(env => searchRegex.test(env))) ||
                  (listing.preferences.facilities && listing.preferences.facilities.some(facility => searchRegex.test(facility))) ||
                  (listing.preferences.ageGroup && listing.preferences.ageGroup.some(age => searchRegex.test(age))))
          );
      }

    
      if (environment) {
          const envArray = environment.split(',');
          listings = listings.filter(listing =>
              listing.preferences &&
              listing.preferences.environment &&
              listing.preferences.environment.some(env => envArray.includes(env))
          );
      }

    
      if (facilities) {
          const facilitiesArray = facilities.split(',');
          listings = listings.filter(listing =>
              listing.preferences &&
              listing.preferences.facilities &&
              listing.preferences.facilities.some(facility => facilitiesArray.includes(facility))
          );
      }

      if (ageGroup) {
          const ageGroupArray = ageGroup.split(',');
          listings = listings.filter(listing =>
              listing.preferences &&
              listing.preferences.ageGroup &&
              listing.preferences.ageGroup.some(age => ageGroupArray.includes(age))
          );
      }

      res.status(200).json(listings);
  } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ message: 'Error fetching listings', error });
  }
};

exports.addSavedListing = async (req, res) => {
    const { listingId } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (!user.savedListings.includes(listingId)) {
        user.savedListings.push(listingId);
        await user.save();
        res.status(200).json({ message: 'Listing saved' });
      } else {
        res.status(400).json({ message: 'Listing already saved' });
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
 
exports.removeSavedListing = async (req, res) => {
    const { listingId } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.savedListings = user.savedListings.filter(id => id.toString() !== listingId);
      await user.save();
      res.status(200).json({ message: 'Listing removed' });
    } catch (error) {
      console.error('Error removing listing:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.getNearbyListings = async (req, res) =>{

    try {
        const { id } = req.query;
    
        if (!id) {
          return res.status(400).json({ error: 'Listing ID is required' });
        }
    
        const listing = await Listing.findById(id).exec();
    
        if (!listing) {
          return res.status(404).json({ error: 'Listing not found' });
        }
    
    
        const community = listing.community;
    
        const listingsInCommunity = await Listing.find({ 
            community,
            _id: { $ne: id }  //excluding the specific lisitng 
          }).exec();

        res.json(listingsInCommunity);
      } catch (error) {
        console.error('Error retrieving listings by community:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  }
  