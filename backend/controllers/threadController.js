const Thread = require('../models/threadModel'); 


exports.createThread = async (req, res) => {
    try {
        const { user_id, community_id, thread_title, thread_description } = req.body; 
        const thread = new Thread({
            user_id,
            community_id,
            thread_title,
            thread_description,
        });

        await thread.save();
        res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find().populate('user_id').populate('community_id');
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
