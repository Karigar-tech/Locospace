const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/tokenauthentication')
const multer = require('multer');
const bcrypt = require("bcrypt") ;
const profileController = require('../controllers/profileController');


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


router.get('/myprofile', authenticateToken , profileController.getMyProfile);

router.put('/edit', upload.single('profilePicture'),  authenticateToken, profileController.editProfile);

router.delete('/delete', authenticateToken, profileController.deleteProfile);


module.exports = router;