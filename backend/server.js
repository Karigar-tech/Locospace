const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS middleware
const mongoose = require('mongoose'); // Import Mongoose
const dotenv = require('dotenv'); // Import dotenv
const appRouter = require('./routes/index'); // Import app routes
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const { app, server } = require('./socket/socket'); // Import socket setup

dotenv.config(); // Load environment variables

const port = process.env.PORT || 5000; // Define port
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const appRouter = require('./routes/index')
const bodyParser = require('body-parser');
 
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const mongoURI = process.env.MONGODB_URI; // MongoDB URI

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

app.use('/api', appRouter); // Mount routes under /api path
app.use('/api/auth', authRoutes); // Mount auth routes under /api/auth path

app.use('/health', (req, res) => {
  res.send('Server is running'); // Health check endpoint
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Log server start message
});
