const replyModel = require('../models/replyModel');
const Thread = require('../models/threadModel'); 
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


exports.createThread = async (req, res) => {
    
    const id= req.user.id
    
    try {
        const { title, description, community_id } = req.body; 
        
        const thread = new Thread({
            user_id: id,
            community_id,
            thread_title: title,
            thread_description: description,
        });
        console.log("Thread added:", thread)
        await thread.save();
        res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteThread = async (req, res) => {
    const { id } = req.params;
    const user_id= req.user.id
    
    try {
        console.log("We here biatch: ", id)
        const thread= await Thread.findById(id);
        if(!thread){res.status(404).json({error: "Thread aint exisitng bruh"})};
        if(thread.user_id.toString()!==user_id.toString()){return res.status(403).json({error: "Unauthorised to delete"})};
        
        const deletedThread = await Thread.findByIdAndDelete(id);
        await replyModel.deleteMany({thread_id: id});
        res.status(200).json({message: "Thread deleted"});

    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

exports.updateThread = async (req, res) => {
    
    const {id}= req.params
    const user_id= req.user.id
    const { thread_title, thread_description, community_id}= req.body;
    console.log("Thread update: ", thread_title, " : ", thread_description, "id: ", id, "Comm_id: ",community_id)
    
    try {        
        const updatedThread = await Thread.findByIdAndUpdate(
            id,
            {  
                user_id: user_id,
                community_id: community_id,
                thread_title: thread_title,
                thread_description: thread_description,
                updatedAt: Date.now() },
                { new: true }
            );
            console.log("Thread added:", updatedThread)

        // await thread.save();
        res.status(201).json(updatedThread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find().populate('user_id').populate('community_id');
        console.log(threads);
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSpecificThreads = async (req, res) => {
    const { id } = req.params; // Correctly destructure comm_id
    try {
        const threads = await Thread.find({ community_id: id }).populate('user_id').populate('community_id');
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserThreads = async (req, res) => {
    const id= req.user.id;

    try {

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const threads = await Thread.find({ user_id: new ObjectId(id) }).populate('user_id', 'username profilePicture');;
        console.log("They aree::",threads);
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
