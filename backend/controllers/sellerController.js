const Listing = require('../models/listingModel');

exports.createListing = async (req, res) => {
    try {
        const listingData = {
            user_id: req.user.id,
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
            listingData.ListingPictures = req.files.map(file => ({
                data: file.buffer,
                contentType: file.mimetype
            }));
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
            updateData.ListingPictures = req.files.map(file => ({
                data: file.buffer,
                contentType: file.mimetype
            }));
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
        res.status(200).json({ message: 'Listing deleted successfully', listing_id: listing._id });  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getSpecificListing = async (req, res) =>{
    try{
        const list = await Listing.findById(req.params.id);

        if (!list) {
    
        return res.status(404).json({ error: 'List not found' });
        }

        res.json(list);

    }catch (error) {
        res.status(400).json({ error: error.message });
    }

};

exports.getAllListings = async (req, res) =>{
    try{
        const list = await Listing.find();

        if (!list) {
    
        return res.status(404).json({ error: 'No listings' });
        }

        res.json(list);

    }catch (error) {
        res.status(400).json({ error: error.message });
    }

};

