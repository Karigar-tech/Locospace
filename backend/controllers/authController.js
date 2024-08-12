const User = require('../models/userModel');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');

// Handle user login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });

        // If user not found, return a 404 response
        if (!user) {
            return res.status(404).json('User not found!');
        }

        // If user found, compare provided password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If password is invalid, return a 401 response
        if (!isPasswordValid) {
            return res.status(401).json('Invalid password!');
        }

        // If password is valid, generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });


        // Return token and user ID in response
        res.json({ token, userId: user._id });
    } catch (error) {
        console.error('Error: not logging in', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

// Handle user registration
exports.signUp = async (req, res) => {
    const { username, password, name, email, contact } = req.body;
    try {
        console.log(req.body);

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            contact,
            address: null,
            name,
        });

        // Save the new user to the database
        await newUser.save();
        
        // Return success response
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to create user!' });
    }
};

// In authController.js
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
