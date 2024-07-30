const User = require('../models/userModel');
const jwt = require('jsonwebtoken'); 
const bcrypt = require("bcrypt") ;

exports.login = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        //not found 
        if(!user){
          res.status(404).json('User not found!');
        }
        if(user){
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if(!isPasswordValid){
            res.status(401).json('Invalid password!');
          }
          else{
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
          }
        }
      } catch (error) {
        console.error('error: not logging in', error);
        res.status(500).json({ error: 'failed to login' });
      }
}
exports.signUp = async (req, res) => {
  const { username, password , name ,email,  contact  } = req.body;
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
      name,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};