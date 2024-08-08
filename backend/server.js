const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const appRouter = require('./routes/index')
const bodyParser = require('body-parser');
 
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

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

app.use('/api', appRouter);

app.use('/health', (req,res)=>{
  res.send('Server is running')
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
