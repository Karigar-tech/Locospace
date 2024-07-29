const mongoose = require('mongoose');

const messageModel = new mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        required: true,
    },
    chatid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Chat',
        default: [],
    },
},{timestamps: true});

const Message = mongoose.model('Message', messageModel);

module.exports = Message;