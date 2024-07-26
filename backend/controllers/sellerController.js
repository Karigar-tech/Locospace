const Listing = require('../models/listingModel');
const User = require('../models/userModel');
const { bucket } = require('../firebaseAdmin');

// Function to generate a public URL for a file
const generatePublicUrl = (file) => {
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
};

exports.createListing = async (req, res) => {
    try {
        const userId = req.user.id;

        //check for 2 listings
        const existingListingsCount = await Listing.countDocuments({ user_id: userId });
        if (existingListingsCount >= 2) {
            return res.status(403).json({ error: "You can only create up to 2 listings." });
        }

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
            // Upload images to Firebase Storage
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
            // Upload images to Firebase Storage
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

        // Optionally delete images from Firebase Storage
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
        const listings = await Listing.find(); // Fetch all listings from MongoDB

        if (!listings || listings.length === 0) {
            return res.status(404).json({ message: 'No listings found' });
        }

        // Construct response with image URLs
        const response = listings.map(listing => {
            return {
                ...listing._doc, // Include listing data
                ListingPictures: listing.ListingPictures // Include image URLs
            };
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getSpecificListing = async (req, res) => {
    try {
        // Fetch the listing by ID
        const listing = await Listing.findById(req.params.id).exec();
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Fetch the user associated with the listing
        const user = await User.findById(listing.user_id).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Construct the response with conditional profilePicture
        const response = {
            ...listing.toObject(), // Include listing data
            user: {
                ...user.toObject(), // Include user data
                profilePicture: user.profilePicture || null // Set profilePicture to null if it doesn't exist
            }
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


