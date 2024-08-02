const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    thread_id: {
        type: Schema.Types.ObjectId,
        ref: 'Thread',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reply', replySchema);
