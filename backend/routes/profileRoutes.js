const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/tokenauthentication')
const multer = require('multer');
const profileController = require('../controllers/profileController');


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


router.get('/', authenticateToken , profileController.getMyProfile);

router.put('/', upload.single('profilePicture'),  authenticateToken, profileController.editProfile);

router.delete('/', authenticateToken, profileController.deleteProfile);


module.exports = router;