const chatRoutes = require('./chatRoutes');
const authRoutes = require('./authRoutes');
const ProfileRoutes = require('./profileRoutes');
const listingRoutes = require('./listingRoutes');
const threadRoutes = require('./threadRoutes'); 
const communityRoute = require('./communityRoutes');

const express = require('express');
const router = express.Router();

router.use('/auth', authRoutes);

router.use('/chat', chatRoutes);

router.use('/profile', ProfileRoutes);

router.use('/listings', listingRoutes);

router.use('/threads', threadRoutes);

router.use('/community', communityRoute);


module.exports = router;