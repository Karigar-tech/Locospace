const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    listing_type: {
        type: String,
        required: true,
    },
    ListingPictures: [String], 
    price: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    bedroom: {
        type: Number,
        required: true,
    },
    bath: {
        type: Number,
        required: true,
    },
    kitchen: {
        type: Number,
        required: true,
    }, 
    area: {
        type: String,
        required: true,
    },
    preferences: {
        environment: {
            type: [String],
            enum: ['Busy', 'Peaceful', 'Green', 'Commercial', 'Supportive', 'Safe', 'Affordable', 'Pet Friendly']
        },
        facilities: {
            type: [String],
            enum: ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Playground']
        },
        ageGroup: {
            type: [String],
            enum: ['Kids', 'Teens', 'Adults', 'Seniors']
        }
    }
   
});

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
