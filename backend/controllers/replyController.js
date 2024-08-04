const Reply = require('../models/replyModel');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

exports.createReply = async (req, res) => {
    console.log("Here")
    const user_id = req.user.id;
    try {
        console.log("Here2: ", req.body)
        const { thread_id, content } = req.body;
        
        if (!ObjectId.isValid(thread_id)) {
            console.log("THREAD ID WRONMG", thread_id, content)
            return res.status(400).json({ error: 'Invalid thread ID' });
        }
        
        const reply = new Reply({
            thread_id: new ObjectId(thread_id),
            user_id: new ObjectId(user_id),
            content
        });
        console.log("Reply added:", reply);
        await reply.save();
        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRepliesByThread = async (req, res) => {
    try {
        const { thread_id } = req.params;
        console.log("Fetching", thread_id)
        
        if (!ObjectId.isValid(thread_id)) {
            
            return res.status(400).json({ error: 'Invalid thread ID' });
        }
        
        const replies = await Reply.find({ thread_id: new ObjectId(thread_id) }).populate('user_id', 'username profilePicture');
        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid reply ID' });
        }
        
        const updatedReply = await Reply.findByIdAndUpdate(
            id,
            { content, updatedAt: Date.now() },
            { new: true }
        );
        
        res.status(200).json(updatedReply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReply = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid reply ID' });
        }
        
        const deletedReply = await Reply.findByIdAndDelete(id);
        res.status(200).json(deletedReply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
