const Community = require('../models/communityModel')
const Listing = require('../models/listingModel');
const User = require('../models/userModel');

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
    const { search } = req.query;
  
    try {
      let communities = [];
  
      if (search) {
        const searchRegex = new RegExp(search, 'i'); 
  
        communities = await Community.find({
          communityName: { $regex: searchRegex }
        });
      } else {
       
        communities = await Community.find();
      }
  
   
      const communitiesWithDetailedListings = await Promise.all(
        communities.map(async community => {
          const detailedListings = await Listing.find({ community: community.communityName });
          return {
            ...community.toObject(),
            detailedListings
          };
        })
      );
  
      res.status(200).json(communitiesWithDetailedListings);
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
  
    
      const detailedListings = await Listing.find({ community: communityName });

      const responseData = {
        communityID: community._id,
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

  exports.getName = async (req, res) => {
    console.log("WE HERE BIATCH");

    const { community_id } = req.params;
    try {
      const community = await Community.findById(community_id);
      if (!community) {
        return res.status(404).json({ message: 'No community of that ID found' });
      }
      res.status(200).json({ communityName: community.communityName });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  //join a community, can join only one. after 3 hours can join anotherr
  exports.joinCommunity = async (req, res) => {
    const userId = req.user.id; 
    const { commID } = req.body;
    
    try {
      console.log(commID)
      const user = await User.findById(userId).exec();
      const newCommunity = await Community.findById(commID).exec();
  
      if (!newCommunity) {
        return res.status(404).json({ error: 'Community not found' });
      }

      //if already part of that community
      if (user.community && user.community.toString() === commID) {
        return res.status(400).json({ message: 'You are already a member of this community' });
      }
  
      if (user.community) {
        //decrease member count in the previous comm
        const oldCommunity = await Community.findById(user.community).exec();
        if (oldCommunity) {
          oldCommunity.communityMembers = Math.max(0, oldCommunity.communityMembers - 1);
          await oldCommunity.save();
        }
        //three hour check
        const lastJoinDate = user.lastCommunityJoinDate;
        const now = new Date();
        const threeHours = 3 * 60 * 60 * 1000;
  
        if (now - new Date(lastJoinDate) < threeHours) {
         
          const timeLeft = threeHours - (now - new Date(lastJoinDate));
          const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
          const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
          const secondsLeft = Math.floor((timeLeft % (60 * 1000)) / 1000);
      
          const timeLeftMessage = `Please wait ${hoursLeft} hours, ${minutesLeft} minutes, and ${secondsLeft} seconds before leaving your currenr community and joining another.`;
      
          return res.status(400).json({ message: timeLeftMessage });
        }
      }
  
      //increase member count in the new comm
      newCommunity.communityMembers = (newCommunity.communityMembers) + 1;
      await newCommunity.save();
  
      //update
      user.community = commID;
      user.lastCommunityJoinDate = new Date();
      await user.save();
  
      res.status(200).json({ message: 'Successfully joined the community', user });
    } catch (error) {
      console.error('Error joining community:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  