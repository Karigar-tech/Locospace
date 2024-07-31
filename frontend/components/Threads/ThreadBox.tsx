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
  return (
    <Container className="thread-box p-3 border rounded mb-3">
      <Row className="align-items-center">
        <Col xs="auto">
          <img src={user_id.profilePicture} alt="PFP" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
        </Col>
        <Col className='thread-username'>
          <strong>{user_id.username}</strong> <span className="text-muted">· Posted: {new Date(createdAt).toLocaleTimeString()}</span>
        </Col>
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
