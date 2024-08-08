import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import '../../styles/main.css'; // Make sure to use a separate CSS file for replies
import { User, Thread, Reply } from '@/types';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap components
import { FaReplyd } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";



interface ReplyBoxProps {
  threadId: Thread;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({ threadId }) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingReply, setEditingReply] = useState<Reply | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');

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
        const response = await fetch(`http://localhost:5000/api/replies/thread/${threadId._id}`, {
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
  }, [threadId]);

  const handleReplyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewReply(event.target.value);
  };

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/replies/createReply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ thread_id: threadId._id, content: newReply }),
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

  const handleDeleteReply = async (replyId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/replies/deleteReply/${replyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setReplies(replies.filter(reply => reply._id !== replyId));
      } else {
        console.error('Failed to delete reply');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditClick = (reply: Reply) => {
    setEditingReply(reply);
    setReplyContent(reply.content);
  };

  const handleEditChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(event.target.value);
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingReply) {
      console.log(editingReply._id)
      try {
        const response = await fetch(`http://localhost:5000/api/replies/updateReply/${editingReply._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ content: replyContent }),
        });
        console.log("Response : ", response)
        if (response.ok) {
          const updatedReply: Reply = await response.json();
          setReplies(replies.map(reply => (reply._id === updatedReply._id ? updatedReply : reply)));
          setEditingReply(null);
          setReplyContent('');
        } else {
          console.error('Failed to update reply');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="threads-list">
      <h4 className='mx-3'>//thread</h4>
      <Container className="thread-box2 p-4 mb-2">
        <Row style={{ flexDirection: 'row', marginTop: '0.1rem' }}>
          <Col style={{ flex: '0 0px' }}>
            {threadId.user_id.profilePicture && threadId.user_id.profilePicture.url ? (
              <img
                src={threadId.user_id.profilePicture.url}
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
      <h5 className='mt-2'>Replies</h5>
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
              <Col className="username-posted">
                <strong>{reply.user_id.username}</strong> <span className="text-mute">· Replied: {new Date(reply.createdAt).toLocaleTimeString()}</span>
              </Col>
              {currentUser && currentUser._id === reply.user_id._id && (
                <div className="reply-actions">
                  <MdDeleteForever size={24} className='delete-button' onClick={() => handleDeleteReply(reply._id)} />
                  <AiFillEdit size={24} className='delete-button' onClick={() => handleEditClick(reply)} />
                </div>
              )}
            </div>
            <p className='mt-2'>{reply.content}</p>
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

      {/* Edit Popup */}
      <Modal show={!!editingReply} onHide={() => setEditingReply(null)}>
        <Modal.Header closeButton>
          <Modal.Title >Edit Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formEditReply">
              <Form.Label className='mb-0'>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={replyContent}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Button variant="secondary" className='my-2' onClick={() => setEditingReply(null)}>
              Cancel
            </Button>
            <Button variant="primary" className='mx-1' type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ReplyBox;
