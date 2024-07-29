const Chat = require("../models/chatModel");   
const Message = require("../models/messageModel");

exports.sendMessages = async (req, res) => {
    try {
        const { id:receiverID } = req.params;
        const senderID = req.user._id;
        const { message } = req.body;
        let chats = await Chat.findOne({
            participants: { $all: [senderID, receiverID] }
        })
        console.log(chats);
        if (!chats) {
            await Chat.create({
                participants: [senderID, receiverID]
            })
        }
        const newMessages = new Message({
            senderID,
            receiverID,
            message,
            chatid: chats._id
        });

        if (newMessages) {
            chats.messages.push(newMessages._id);
        }

        await Promise.all([newMessages.save(), chats.save()]);

        res.status(201).send(newMessages);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
};