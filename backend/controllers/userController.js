const User = require('../models/userModel');
const bcrypt = require("bcrypt") ;



exports.signUp = async (req, res) => {
    const { username, password , name ,email,  contact  } = req.body;
    //console.log( location.latitude, location.longitude);
    //console.log(location)
    try {
      console.log(req.body)
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // CREATE A NEW USER AND SAVE TO DB
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        contact,
        address:null,
        //community,
        //profilePicture,
        name,
        // location: {
        //   lat: location.latitude,
        //   lng: location.longitude,
        // },
      });
  
      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to create user!" });
    }
}