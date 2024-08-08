import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import '../../styles/main.css';
import { User, Community, Reply } from '@/types';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { AiFillEdit } from "react-icons/ai";

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
  const [editingThread, setEditingThread] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(thread_title);
  const [editedDescription, setEditedDescription] = useState<string>(thread_description);

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

  const handleEditClick = () => {
    setEditingThread(true);
  };

  const handleEditChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'title') {
      setEditedTitle(value);
    } else if (name === 'description') {
      setEditedDescription(value);
    }
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/threads/updateThread/${_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_title: editedTitle,
          thread_description: editedDescription,
        }),
      });

      if (response.ok) {
        setEditingThread(false);
      } else {
        console.error('Failed to update thread');
      }
    } catch (error) {
      console.error('Error updating thread:', error);
    }
  };

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
        <Col className="thread-username">
          <strong>{user_id.username}</strong> <span className="text-muted">· Posted: {new Date(createdAt).toLocaleTimeString()}</span>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <p className="thread-title">{thread_title}</p>
          <p className="thread-description">{thread_description}</p>
        </Col>
        <div className="reply-actions">
          <AiFillEdit size={24} className='delete-button' onClick={handleEditClick} />
        </div>
      </Row>
      <Row className="align-items-center justify-content-between mt-3">
        <Col className="d-flex">
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

      {/* Edit Popup */}
      <Modal show={editingThread} onHide={() => setEditingThread(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Thread</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formEditThreadTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editedTitle}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEditThreadDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editedDescription}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Button variant="secondary" className="my-2" onClick={() => setEditingThread(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="mx-1" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ThreadBox;
