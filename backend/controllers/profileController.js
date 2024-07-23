const User = require('../models/userModel');
const multer = require('multer');
const bcrypt = require("bcrypt") ;


const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

exports.getMyProfile = async (req, res) => {
    const id = req.user.id;


    try {
          const user = await User.findById(id);
    
          //not found 
          if(!user){
            res.status(404).json('User not found!');
          }
    
          if(user){
    
            if(user.profilePicture){
    
                //convert the image buffer to a Base64 string
                const unit8Array = new Uint8Array(user.profilePicture.data);
                const base64string = Buffer.from(unit8Array).toString('base64');
                
                const userDataWithBase64Image = { ...user._doc, profilePicture: base64string };
    
                res.status(200).json(userDataWithBase64Image)
            }
            else{
                res.status(200).json(user)
            }  
    
          }
        
        } catch (error) {
          console.error('error: not able to get user', error);
          res.status(500).json({ error: 'failed to get user' });
        }
}
exports.editProfile = async (req, res) => {
    const id = req.user.id;
    let  profilePicture = req.file; 
    //const {  password, name, email, address, profilePicture, contact } = req.body;
    const {  password, name, email, address, contact } = req.body;
  
    try {
      //const updatedFields = { name, email, address, profilePicture, contact };
      const updatedFields = { name, email, address, contact };
  
      if (password) {
        updatedFields.password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      if (profilePicture) {
        updatedUser.profilePicture = {
          data: profilePicture.buffer,
          contentType: profilePicture.mimetype
        };
      }

      await updatedUser.save();
  
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to update user!" });
    }
}
exports.deleteProfile = async (req, res) => {
    const  id  = req.user.id;
  try {
      await User.findByIdAndDelete(id);
      res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete profile' });
  }
}