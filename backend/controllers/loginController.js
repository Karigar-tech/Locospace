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
