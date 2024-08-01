const Thread = require('../models/threadModel'); 


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


exports.getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find().populate('user_id').populate('community_id');
        console.log(threads);
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
