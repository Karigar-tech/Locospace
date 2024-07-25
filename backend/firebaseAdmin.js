// firebaseAdmin.js
require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./locospace-db7d8-firebase-adminsdk-t2pn7-094c75b21b'); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET_NAME
  });
}

const bucket = admin.storage().bucket();

module.exports = { bucket };
