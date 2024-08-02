import React from 'react';
import '../../styles/main.css';
import { User } from '@/types';
import { Community } from '@/types';
import { Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { FaReply } from 'react-icons/fa';

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
  
  
  

  return (
    <Container className="thread-box p-4 mb-2" >
      <Row style ={{flexDirection: 'row', marginTop: '0.1rem' }} >
        <div style= {{flex: '0 0px'}}  >
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
        </div>
        <div className='thread-username'>
          <strong>{user_id.username}</strong> <span className="text-muted">· Posted: {new Date(createdAt).toLocaleTimeString()}</span>
        </div>
      </Row>
      <Row className="mt-2">
        <Col>
          <p className="thread-title">{thread_title}</p>
          <p className="thread-description">{thread_description}</p>
        </Col>
        <Col>
          <FaReply  />
        </Col>
      </Row>
    </Container>
  );
};

export default ThreadBox;
