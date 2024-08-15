"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent, useRef } from "react";
import "../../styles/main.css"; // Make sure to use a separate CSS file for replies
import { User, Thread, Reply } from "@/types";
import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap"; // Import Bootstrap components
import { FaReplyd } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import Spinner from "../../utils/Spinner";
import DocumentPreview from "./DocPreview";
import {
  FaImage,
  FaPaperclip,
  FaPaperPlane,
  FaSmile,
  FaTimes,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

interface ReplyBoxProps {
  threadId: Thread;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({ threadId }) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingReply, setEditingReply] = useState<Reply | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(true);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const docUploadRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    imageUploadRef.current?.click();
  };

  const handleDocClick = () => {
    docUploadRef.current?.click();
  };

  useEffect(() => {
    // Fetch current user
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/user`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const user: User = await response.json();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/replies/thread/${threadId._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data: Reply[] = await response.json();
        setReplies(data);
        setShouldFetch(false);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };

    if (shouldFetch) {
      fetchReplies();
    }
  }, [shouldFetch, threadId]);

  const handleReplyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewReply(event.target.value);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoadingImage(true);
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setLoadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoadingDoc(true);
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const url = URL.createObjectURL(file);
      setDocFile(file);
      setLoadingDoc(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  const handleRemoveDoc = () => {
    setDocFile(null);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setNewReply((prevReply) => prevReply + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("thread_id", threadId._id.toString());
      formData.append("content", newReply);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (docFile) {
        formData.append("document", docFile);
      }

      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/replies/createReply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const reply: Reply = await response.json();
        setReplies([...replies, reply]);
        setNewReply("");
        setImageFile(null);
        setDocFile(null);
        setImagePreview(null);
        setDocPreview(null);
        setShouldFetch(true);
      } else {
        console.error("Failed to add reply");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/replies/deleteReply/${replyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setReplies(replies.filter((reply) => reply._id !== replyId));
      } else {
        console.error("Failed to delete reply");
      }
    } catch (error) {
      console.error("Error:", error);
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
      console.log(editingReply._id);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/replies/updateReply/${editingReply._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ content: replyContent }),
          }
        );
        console.log("Response : ", response);
        if (response.ok) {
          const updatedReply: Reply = await response.json();
          setReplies(
            replies.map((reply) =>
              reply._id === updatedReply._id ? updatedReply : reply
            )
          );
          setEditingReply(null);
          setReplyContent("");
        } else {
          console.error("Failed to update reply");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="threads-list">
      <h4 className="mx-3">Thread</h4>
      <Container className="thread-box2 p-4 mb-2">
        <Row style={{ flexDirection: "row", marginTop: "0.1rem" }}>
          <Col style={{ flex: "0 0px" }}>
            {threadId.user_id.profilePicture &&
            threadId.user_id.profilePicture.url ? (
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
          <Col className="thread-username">
            <strong>{threadId.user_id.username}</strong>{" "}
            <span className="text-muted">
              · Posted: {new Date(threadId.createdAt).toLocaleTimeString()}
            </span>
          </Col>
        </Row>
        <Row className="mt-1">
          <div className="title-container">
            <FaReplyd size={28} className="reply-icon" />
            <span className="thread-title">{threadId.thread_title}</span>
          </div>
          <p className="thread-description">{threadId.thread_description}</p>
        </Row>
        <Row>
          {threadId.image && (
            <div className="thread-image-container">
              <img
                src={threadId.image}
                alt="Thread Image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "80%",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}
        </Row>
      </Container>
      <h5 className="mt-2">Replies</h5>
      {replies.length > 0 ? (
        replies.map((reply) => (
          <div key={reply._id} className="reply-box">
            <div className="reply-header">
              {reply.user_id.profilePicture &&
              reply.user_id.profilePicture.url ? (
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
                <strong>{reply.user_id.username}</strong>{" "}
                <span className="text-mute">
                  · Replied: {new Date(reply.createdAt).toLocaleTimeString()}
                </span>
              </Col>
              {currentUser && currentUser._id === reply.user_id._id && (
                <div className="reply-actions">
                  <MdDeleteForever
                    size={24}
                    className="delete-button"
                    onClick={() => handleDeleteReply(reply._id)}
                  />
                  <AiFillEdit
                    size={24}
                    className="delete-button"
                    onClick={() => handleEditClick(reply)}
                  />
                </div>
              )}
            </div>
            <p className="mt-2">{reply.content}</p>
            {reply.image && (
              <div>
                <img
                  src={reply.image}
                  alt="Reply Image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "80%",
                    borderRadius: "10px",
                  }}
                />
              </div>
            )}

            {reply.document && <DocumentPreview documentUrl={reply.document} />}
          </div>
        ))
      ) : (
        <p>No replies found</p>
      )}
      <form onSubmit={handleReplySubmit} className="reply-form">
        <div className="preview-container">
          {imageFile && (
            <div className="preview-item">
              {loadingImage ? (
                <Spinner />
              ) : (
                <div className="preview-content">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Image Preview"
                    className="preview-image"
                  />
                  <button className="remove-btn" onClick={handleRemoveImage}>
                    <FaTimes size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {docFile && (
            <div className="preview-item">
              {loadingDoc ? (
                <Spinner />
              ) : (
                <div className="preview-content">
                  <embed
                    src={URL.createObjectURL(docFile)}
                    type="application/pdf"
                    className="preview-doc"
                    title="Document Preview"
                  />
                  <button className="remove-btn" onClick={handleRemoveDoc}>
                    <FaTimes size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="textarea-container">
          <button
            type="button"
            className="icon-button"
            onClick={handleImageClick}
          >
            <FaImage />
          </button>
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            onChange={handleImageChange}
            style={{ display: "none" }}
            ref={imageUploadRef}
          />
          <button
            type="button"
            className="icon-button"
            onClick={handleDocClick}
          >
            <FaPaperclip />
          </button>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            id="doc-upload"
            onChange={handleDocChange}
            style={{ display: "none" }}
            ref={docUploadRef}
          />

          <textarea
            value={newReply}
            onChange={handleReplyChange}
            placeholder="Write your reply here..."
            required
            className="reply-textarea"
          />
          <div className="emoji-picker-container">
            <button
              type="button"
              className="smile-icon"
              onClick={toggleEmojiPicker}
            >
              <FaSmile size={20} />
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <button type="submit" className="icon-button">
            <FaPaperPlane />
          </button>
        </div>
      </form>

      {/* Edit Popup */}
      <Modal show={!!editingReply} onHide={() => setEditingReply(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formEditReply">
              <Form.Label className="mb-0">Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={replyContent}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Button
              variant="secondary"
              className="my-2"
              onClick={() => setEditingReply(null)}
            >
              Cancel
            </Button>
            <Button variant="primary" className="mx-1" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ReplyBox;
