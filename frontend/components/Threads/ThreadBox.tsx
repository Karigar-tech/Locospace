import React from 'react';
import '../../styles/main.css';
import { User } from '@/types';
import { Community } from '@/types';
import { Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components

interface BoxProps {
  _id: string;
  user_id: User;
  community_id: Community;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
  
}

const ThreadBox: React.FC<BoxProps> = ({ _id, user_id, community_id, thread_description, createdAt, updatedAt }) => {
  
  const checkPFP = () => {
    if (user_id.profilePicture.url) {
      return true;
  }
  return false;
  }

  return (
    <Container className="thread-box p-3 border rounded mb-3">
      <Row style ={{flexDirection: 'row', }} >
        <div style= {{flex: '0 0px'}}  >
          {user_id.profilePicture && user_id.profilePicture.url ? (
            <img
              src={user_id.profilePicture.url}
              alt="PFP"
              className="profile-pic"
            />
          ) : (
            <img
              src="path/to/placeholder-image.png" // Replace with the actual path to your placeholder image
              alt="pfp"
              className="rounded-circle"
              style={{ width: '40px', height: '40px' }}
            />
          )}
        </div>
        <div className='thread-username'>
          <strong>{user_id.username}</strong> <span className="text-muted">· Posted: {new Date(createdAt).toLocaleTimeString()}</span>
        </div>
      </Row>
      <Row className="mt-2">
        <Col>
          <p className="thread-description">{thread_description}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ThreadBox;
