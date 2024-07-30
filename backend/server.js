const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UserRoute = require('./routes/userRoutes');
const LoginRoute = require('./routes/loginRoutes');
const ProfileRoutes = require('./routes/profileRoutes');
const listingRoutes = require('./routes/sellerRoutes');
const threadRoutes = require('./routes/threadRoutes'); // Import thread routes

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;

if (mongoURI) {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
} else {
  console.error('MONGODB_URI is not defined in .env file');
}

app.use('/api', UserRoute);
app.use('/api', LoginRoute);
app.use('/api', ProfileRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/threads', threadRoutes); // Add thread routes

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
