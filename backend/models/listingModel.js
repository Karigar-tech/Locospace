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
    preferences: [{ type: String }]
});

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
