const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({

    communityName: {
        type: String,
        required: true,
    },
    // location: {
    //     type: String,
    //     required: true,

    // },
    communityPicture: {    
        type: String,
    },

    communityMembers:{
        type: Number
    },

    communityListings: 
        [ 
            {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Listing',}
        ]

    
});

const Community =   mongoose.model('Community', CommunitySchema);

module.exports = Community;
