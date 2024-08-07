const User = require('../models/userModel');
const Listing = require('../models/listingModel')
const multer = require('multer');
const bcrypt = require("bcrypt");
const { bucket } = require('../firebaseAdmin');

const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

// Function to generate a public URL for a file
const generatePublicUrl = (file) => {
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
};

exports.getMyProfile = async (req, res) => {
    const id = req.user.id;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json('User not found!');
        }

        const listings = await Listing.find({ user_id: id }); 


        if (user.profilePicture && user.profilePicture.url) {
            // Use the URL from profilePicture
            const userDataWithProfilePicUrl = { ...user._doc, profilePicture: user.profilePicture.url };

            return res.status(200).json({ user: userDataWithProfilePicUrl, listings });
        } else {
            return res.status(200).json({ user, listings });
        }
    } catch (error) {
        console.error('Error: Not able to get user', error);
        return res.status(500).json({ error: 'Failed to get user' });
    }
}
exports.getUser = async (req, res) => {
    console.log("MILJA")
    const id = req.user.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json('User not found!');
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error: Not able to get user', error);
        return res.status(500).json({ error: 'Failed to get user' });
    }
}



exports.editProfile = async (req, res) => {
    const id = req.user.id;
    let profilePicture = req.file;
    const { password, name, email, address, contact } = req.body;

    try {
        const updatedFields = { name, email, address, contact };

        if (password) {
            updatedFields.password = await bcrypt.hash(password, 10);
        }

        if (profilePicture) {
            // Upload image to Firebase Storage
            const blob = bucket.file(`profiles/${Date.now()}_${profilePicture.originalname}`);
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: profilePicture.mimetype
                }
            });

            // Create a promise for the upload process
            const uploadPromise = new Promise((resolve, reject) => {
                blobStream.on('error', reject);
                blobStream.on('finish', () => {
                    const publicUrl = generatePublicUrl(blob);
                    resolve(publicUrl);
                });
                blobStream.end(profilePicture.buffer);
            });

            // Get the URL of the uploaded image
            const publicUrl = await uploadPromise;
            updatedFields.profilePicture = { filePath: blob.name, url: publicUrl };
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update user!" });
    }
};

exports.deleteProfile = async (req, res) => {
    const id = req.user.id;

    try {
        const user = await User.findById(id);
        if (user && user.profilePicture && user.profilePicture.filePath) {
            // Delete profile picture from Firebase Storage
            const filePath = user.profilePicture.filePath;
            const file = bucket.file(filePath);
            await file.delete();
        }

        await User.findByIdAndDelete(id);
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete profile' });
    }
};


exports.getUsername = async (req, res) => {
  const { id } = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error('Error fetching username:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

