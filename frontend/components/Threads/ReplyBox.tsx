import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import '../../styles/main.css'; // Make sure to use a separate CSS file for replies
import { User } from '@/types';
import { Thread } from '@/types';
import ThreadBox from './ThreadBox';
import { Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { FaReplyd } from "react-icons/fa";

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
          'Content-Type': 'application/json',
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
      <Container className="thread-box2 p-4 mb-2" >
      <Row style ={{flexDirection: 'row', marginTop: '0.1rem' }} >
        <Col style= {{flex: '0 0px'}}  >
          {threadId.user_id.profilePicture && threadId.user_id.profilePicture.url ? (
            <img
              src={threadId.user_id.profilePicture.url}
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
        </Col>
        <Col className='thread-username'>
          <strong>{threadId.user_id.username}</strong> <span className="text-muted">· Posted: {new Date(threadId.createdAt).toLocaleTimeString()}</span>
        </Col>
      </Row>
      <Row className="mt-1">
        <div className="title-container">
            <FaReplyd size={28} className='reply-icon' />
            <span className="thread-title">{threadId.thread_title}</span>
        </div>
        <p className="thread-description">{threadId.thread_description}</p>
      </Row>

    </Container>
      <h5 className='mt-2'>Replies  </h5>
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
        <button className="reply-button">Add Reply</button>
      </form>
    </div>
  );
};

export default ReplyBox;
