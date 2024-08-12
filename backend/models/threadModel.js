const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    community_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Community'
    },
    thread_title: {  
        type: String,
        required: true
    },
    thread_description: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        default: null
    },
    document: {
        type: String,  
        default: null
    },
},
{
    timestamps: true,
});

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;
