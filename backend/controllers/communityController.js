const Community = require('../models/communityModel')
const Listing = require('../models/listingModel');

const { bucket } = require('../firebaseAdmin');

const generatePublicUrl = (file) => {
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
};

exports.createCommunity = async (req, res) => {
    const { communityName } = req.body;
    let communityPicture;
  
    try {
      if (req.file) {
       
        const blob = bucket.file(`communities/${Date.now()}_${req.file.originalname}`);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: req.file.mimetype
          }
        });
  
       
        const uploadPromise = new Promise((resolve, reject) => {
          blobStream.on('error', reject);
          blobStream.on('finish', () => {
            const publicUrl = generatePublicUrl(blob);
            resolve(publicUrl);
          });
          blobStream.end(req.file.buffer);
        });
  
        communityPicture = await uploadPromise;
      }
  
      const newCommunity = new Community({
        communityName,
        communityPicture,
        communityMembers: 0,
        communityListings: []
      });
  
      await newCommunity.save();
      res.status(201).json({ message: 'Community created successfully', community: newCommunity });
    } catch (error) {
      console.error('Error creating community:', error);
      res.status(500).json({ message: 'Error creating community', error });
    }
  };
  
  exports.getAllCommunities = async (req, res) => {
    const { environment, facilities, ageGroup, keyword } = req.query; //extracting filters from query parameters
  
    try {
      const communities = await Community.find();
      let filteredCommunities = [];
  
      for (let community of communities) {
        
        const listingsQuery = {
          location: new RegExp(community.community_name, 'i') //case-insensitive match
        };
  
        if (keyword) {
          listingsQuery.$or = [
            { title: new RegExp(keyword, 'i') },
            { description: new RegExp(keyword, 'i') },
            { location: new RegExp(keyword, 'i') }
          ];
        }
  
        // Apply additional filters if provided
        if (environment) {
          listingsQuery['preferences.environment'] = { $in: environment.split(',') };
        }
        if (facilities) {
          listingsQuery['preferences.facilities'] = { $in: facilities.split(',') };
        }
        if (ageGroup) {
          listingsQuery['preferences.ageGroup'] = { $in: ageGroup.split(',') };
        }
  
        const listings = await Listing.find(listingsQuery);
  
        if (listings.length > 0) {
          filteredCommunities.push({
            ...community._doc,
            communityListings: listings
          });
        }
      }
  
      res.status(200).json(filteredCommunities);
    } catch (error) {
      console.error('Error fetching communities:', error);
      res.status(500).json({ message: 'Error fetching communities', error });
    }
  };