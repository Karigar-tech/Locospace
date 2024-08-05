import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import '../../styles/main.css'; // Make sure to use a separate CSS file for replies
import { User } from '@/types';
import { Thread } from '@/types';

interface Reply {
  _id: number;
  user_id: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ReplyBoxProps {
  threadId: Thread;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({ threadId }) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState<string>('');

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/replies/thread/${threadId._id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setReplies(data);
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };

    fetchReplies();
  }, [threadId]);

  const handleReplyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewReply(event.target.value);
  };

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const thread_id = threadId._id;
      const response = await fetch('http://localhost:5000/api/replies/createReply', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ thread_id, content: newReply }),
      });

      if (response.ok) {
        const reply: Reply = await response.json();
        setReplies([...replies, reply]);
        setNewReply('');
      } else {
        console.error('Failed to add reply');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="threads-list">
      <h2>Replies for {threadId.thread_title} </h2>
      <h5>{threadId.thread_description}</h5>
      {replies.length > 0 ? (
        replies.map(reply => (
          <div key={reply._id} className="reply-box">
            <div className="reply-header">
              {reply.user_id.profilePicture && reply.user_id.profilePicture.url ? (
                <img
                  src={reply.user_id.profilePicture.url}
                  alt="PFP"
                  className="profile-pic"
                />
              ) : (
                <img
                  src="/osama.jpg" // Replace with the actual path to your placeholder image
                  alt="pfp"
                  className="profile-pic"
                />
              )}
              <div className="username-posted">
                <strong>{reply.user_id.username}</strong> 
                <span className="text-muted">· Posted: {new Date(reply.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
            <h4>{reply.content}</h4>
          </div>
        ))
      ) : (
        <p>No replies found</p>
      )}

      <form onSubmit={handleReplySubmit}>
        <textarea
          value={newReply}
          onChange={handleReplyChange}
          placeholder="Write your reply here..."
          required
        />
        <button type="submit">Add Reply</button>
      </form>
    </div>
  );
};

export default ReplyBox;
