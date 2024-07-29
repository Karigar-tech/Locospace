const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({

    community_id: {
        type: Number,
        required: true,
    },

    community_name: {
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

    
});

const Community =   mongoose.model('Community', CommunitySchema);

module.exports = Community;
