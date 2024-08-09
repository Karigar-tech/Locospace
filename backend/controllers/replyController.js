const Reply = require('../models/replyModel');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { bucket } = require('../firebaseAdmin');

const generatePublicUrl = (file) => {
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
};

exports.createReply = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { thread_id, content } = req.body;
        
        if (!ObjectId.isValid(thread_id)) {
            console.log("THREAD ID WRONMG", thread_id, content)
            return res.status(400).json({ error: 'Invalid thread ID' });
        }
        
        const replyData = new Reply({
            thread_id: new ObjectId(thread_id),
            user_id: new ObjectId(user_id),
            content
        });

        console.log("Reply added:", replyData);
        console.log("hehe image", req.files.image)
        //image uploadd
        if(req.files && req.files.image){
            const imageFile = req.files.image[0];
            const blob = bucket.file(`replies/images/${Date.now()}_${imageFile.originalname}`);
            const blobStream = blob.createWriteStream({ metadata: { contentType: imageFile.mimetype } });

            await new Promise((resolve, reject) => {
                blobStream.on('error', reject);
                blobStream.on('finish', () => {
                    replyData.image = generatePublicUrl(blob);
                    resolve();
                });
                blobStream.end(imageFile.buffer);
            });
        }

        //doc upoad
        if (req.files && req.files.document) {
            const documentFile = req.files.document[0];
            const blob = bucket.file(`replies/documents/${Date.now()}_${documentFile.originalname}`);
            const blobStream = blob.createWriteStream({ metadata: { contentType: documentFile.mimetype } });

            await new Promise((resolve, reject) => {
                blobStream.on('error', reject);
                blobStream.on('finish', () => {
                    replyData.document = generatePublicUrl(blob);
                    resolve();
                });
                blobStream.end(documentFile.buffer);
            });
        }
        
        const reply = new Reply(replyData);
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
    console.log("Here")
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
        const userId = req.user.id; // Assumes authenticateToken middleware sets req.user

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid reply ID' });
        }

        const reply = await Reply.findById(id);
        if (!reply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        if (reply.user_id.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Unauthorized to delete this reply' });
        }

        const deletedReply = await Reply.findByIdAndDelete(id);
        res.status(200).json(deletedReply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
