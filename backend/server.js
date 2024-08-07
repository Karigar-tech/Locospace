const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const appRouter = require('./routes/index');
const {app , server } = require('./socket/socket');

dotenv.config();

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

app.use('/api', appRouter);

app.use('/health', (req,res)=>{
  res.send('Server is running')
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
