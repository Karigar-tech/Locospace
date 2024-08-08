import React, { useEffect, useState } from 'react';
import { User, Community, Reply } from '@/types';
import { Container, Row, Col } from 'react-bootstrap';

interface BoxProps {
  _id: number;
  user_id: User;
  community_id: Community;
  thread_title: string;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
}

const ThreadBox: React.FC<BoxProps> = ({ _id, user_id, community_id, thread_title, thread_description, createdAt, updatedAt }) => {
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/replies/thread/${_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data: Reply[] = await response.json();
        setReplies(data);
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };
    fetchReplies();
  }, [_id]);

  const uniqueUsers = Array.from(new Set(replies.map(reply => reply.user_id._id)))
    .map(id => replies.find(reply => reply.user_id._id === id)?.user_id)
    .slice(0, 3);

  return (
    <Container className="thread-box p-4 mb-2">
      <Row style={{ flexDirection: 'row', marginTop: '0.1rem' }}>
        <Col style={{ flex: '0 0px' }}>
          {user_id.profilePicture && user_id.profilePicture.url ? (
            <img
              src={user_id.profilePicture.url}
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
        <Col className=" thread-username">
          <strong>{user_id.username}</strong> <span className="text-muted">· Posted: {new Date(createdAt).toLocaleTimeString()}</span>
        </Col>
      </Row>
      <Row className="mt-2">
        <p className="thread-title">{thread_title}</p>
        <p className="thread-description">{thread_description}</p>
      </Row>
      <Row className="align-items-center justify-content-between mt-3">
        {/* <Col xs="auto">
          <button className="reply-button">Reply</button>
        </Col> */}
        <Col className="d-flex ">
          {uniqueUsers.map(user => (
            <div key={user?._id} className="reply-user-image-col">
              {user?.profilePicture && user?.profilePicture.url ? (
                <img
                  src={user.profilePicture.url}
                  alt="PFP"
                  className="reply-user-image"
                />
              ) : (
                <img
                  src="/osama.jpg" // Replace with the actual path to your placeholder image
                  alt="pfp"
                  className="reply-user-image"
                />
              )}
            </div>
          ))}
          <div className="reply-count-col">
            {replies.length} replies
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ThreadBox;
