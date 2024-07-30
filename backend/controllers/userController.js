const User = require('../models/userModel');
const Chat = require('../models/chatModel'); 
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
};

exports.searchUser = async (req, res) => {
  try{
    const search = req.query.search;
    const currentUser = req.user._id;
    const user = await User.find({
      $and: [
        {
          name: { $regex:'.*'+search+'.*', $options: 'i'},
          username: { $regex:'.*'+search+'.*', $options: 'i'}
        },{
          _id:{$ne:currentUser}
        }
      
      ]
    }).select("-password").select("-email").select("-contact").select("-location");
    res.status(200).send(user);

  }catch{
    res.status(500).send({
      success: false,
      message: error  
  })
  console.log(error);
  }
};

exports.getChatters = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const currentChatters = await Chat.find({
      participants: currentUser
    }).sort({
      updatedAt: -1
    });

    if (!currentChatters || currentChatters.length === 0) {
      return res.status(200).send([]);
    }

    const participantsID = currentChatters.reduce((ids, chat) => {
      const otherParticipants = chat.participants.filter(id => id.toString() !== currentUser.toString());
      return [...ids, ...otherParticipants];
    }, []);

    const otherParticipantsID = participantsID.filter(id => id.toString() !== currentUser.toString());
    const users = await User.find({ _id: { $in: otherParticipantsID } })
      .select("-password -email -contact -location");

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message
    });
  }
};