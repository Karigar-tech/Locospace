import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { User, Community, Reply, Thread } from '@/types';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { AiFillEdit } from "react-icons/ai";
import '../../styles/main.css';

interface BoxProps {
  _id: number;  // Ensure this is a string
  user_id: User;
  community_id: Community;
  thread_title: string;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
  onClick: (thread: Thread) => void;  // Pass the entire thread
}



const ThreadBox: React.FC<BoxProps> = ({ _id, user_id, community_id, thread_title, thread_description, createdAt, updatedAt, onClick }) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [editingThread, setEditingThread] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(thread_title);
  const [editedDescription, setEditedDescription] = useState<string>(thread_description);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch current user
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const user: User = await response.json();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

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

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from propagating to the thread box container
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
          community_id: community_id._id,
          thread_description: editedDescription,
        }),
      });

      if (response.ok) {
        setEditingThread(false);
      } else {
        console.error('Failed to update thread: ', response);
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
              src="/no-profile-picture-15257.svg" // Replace with the actual path to your placeholder image
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
        <Col className='thread-headings'>
          <p className="thread-title">{thread_title}</p>
          <p className="thread-description">{thread_description}</p>
        </Col>
        {currentUser && currentUser._id === user_id._id && (
          <Col className='open-thread-container'>
            <AiFillEdit size={24} className='delete-button' onClick={handleEditClick} />
          </Col>)
        }
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
        <Col className="open-thread-container">
          <Button variant="primary" className="replybox-button" onClick={() => onClick({ _id, user_id, community_id, thread_title, thread_description, createdAt, updatedAt })}>
          Open Thread
          </Button>
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
