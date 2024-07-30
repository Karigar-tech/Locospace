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
    const { environment, facilities, ageGroup, keyword } = req.query;
  
    try {
      const communities = await Community.find();
  
      let filteredCommunities = communities;
  
      if (keyword) {
        const keywordRegex = new RegExp(keyword, 'i');
        filteredCommunities = filteredCommunities.filter(community =>
          community.communityName && community.communityName.match(keywordRegex)
        );
      }
  
      if (environment) {
        filteredCommunities = filteredCommunities.filter(community =>
          community.preferences && 
          community.preferences.environment && 
          community.preferences.environment.some(env => environment.split(',').includes(env))
        );
      }
  
      if (facilities) {
        filteredCommunities = filteredCommunities.filter(community =>
          community.preferences && 
          community.preferences.facilities && 
          community.preferences.facilities.some(facility => facilities.split(',').includes(facility))
        );
      }
  
      if (ageGroup) {
        filteredCommunities = filteredCommunities.filter(community =>
          community.preferences && 
          community.preferences.ageGroup && 
          community.preferences.ageGroup.some(age => ageGroup.split(',').includes(age))
        );
      }
  
      // Respond with the filtered communities
      res.status(200).json(filteredCommunities);
    } catch (error) {
      console.error('Error fetching communities:', error);
      res.status(500).json({ message: 'Error fetching communities', error });
    }
  };
  
  exports.getCommunityDetails = async (req, res) => {
    const communityName = req.params.name;
  
    try {
      const community = await Community.findOne({ communityName }).populate('communityListings');
  
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
  
    
      const detailedListings = await Listing.find({ _id: { $in: community.communityListings } });
  
      const responseData = {
        communityName: community.communityName,
        communityPicture: community.communityPicture,
        communityMembers: community.communityMembers,
        detailedListings,
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching community details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };