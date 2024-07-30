"use client";
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

exports.sendMessages = async (req, res) => {
  try {
    const { id: receiverID } = req.params;
    const senderID = req.user._id;
    const { message } = req.body;
    let chats = await Chat.findOne({
      participants: { $all: [senderID, receiverID] },
    });
    console.log(chats);
    if (!chats) {
      await Chat.create({
        participants: [senderID, receiverID],
      });
    }
    const newMessages = new Message({
      senderID,
      receiverID,
      message,
      chatid: chats._id,
    });

    if (newMessages) {
      chats.messages.push(newMessages._id);
    }

    await Promise.all([newMessages.save(), chats.save()]);

    res.status(201).send(newMessages);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: receiverID } = req.params;
    const senderID = req.user._id;

    const chat = await Chat.findOne({
      participants: { $all: [senderID, receiverID] },
    }).populate("messages");

    if (!chat) return res.status(200).send([]);
    const message = chat.messages;
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

exports.searchUser = async (req, res) => {
  try {
    const search = req.query.search;
    const currentUser = req.user._id;
    const user = await User.find({
      $and: [
        {
          name: { $regex: ".*" + search + ".*", $options: "i" },
          username: { $regex: ".*" + search + ".*", $options: "i" },
        },
        {
          _id: { $ne: currentUser },
        },
      ],
    })
      .select("-password")
      .select("-email")
      .select("-contact")
      .select("-location");
    res.status(200).send(user);
  } catch {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

exports.getChatters = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const currentChatters = await Chat.find({
      participants: currentUser,
    }).sort({
      updatedAt: -1,
    });

    if (!currentChatters || currentChatters.length === 0) {
      return res.status(200).send([]);
    }

    const participantsID = currentChatters.reduce((ids, chat) => {
      const otherParticipants = chat.participants.filter(
        (id) => id.toString() !== currentUser.toString()
      );
      return [...ids, ...otherParticipants];
    }, []);

    const otherParticipantsID = participantsID.filter(
      (id) => id.toString() !== currentUser.toString()
    );
    const users = await User.find({ _id: { $in: otherParticipantsID } }).select(
      "-password -email -contact -location"
    );

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};
