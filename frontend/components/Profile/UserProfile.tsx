import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../../styles/profile.css"; // Adjust path based on your folder structure
import {
  BsPencilSquare,
  BsPersonFill,
  BsPeopleFill,
  BsCamera,
} from "react-icons/bs";
import { IoClose } from "react-icons/io5";

import { Listing, User } from "../../types";


interface UserProfileProps {
  onProfileUpdate: (profile: { user: User; listings: Listing[] }) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onProfileUpdate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureBase64, setProfilePictureBase64] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);

  const getData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch("http://localhost:5000/api/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const Data = await response.json();
        setUsername(Data.user.username);
        setName(Data.user.name);
        setEmail(Data.user.email);
        setAddress(Data.user.address);
        setContact(Data.user.contact);
        setProfilePictureBase64(Data.user.profilePicture);
        console.log("profileee" ,Data);
        setListings(Data.listings);
        onProfileUpdate({ user: Data.user, listings: Data.listings });
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("contact", contact);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    if (password) {
      formData.append("password", password);
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Profile updated successfully");
        getData();
        setShowModal(false);
      } else {
        console.log("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePictureBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="profile-header">
        <h2>User Profile</h2>
        <hr className="header-line" />
      </div>
      <div className="profile-container">
        <div className="profile-picture">
          {profilePictureBase64 ? (
            <img
              src={profilePictureBase64}
              alt="Profile"
              className="profile-img"
            />
          ) : (
            <BsPersonFill className="profile-placeholder-icon" />
          )}
          <BsPencilSquare
            className="edit-icon"
            onClick={() => setShowModal(true)}
          />
        </div>
        <div className="profile-details">
          <div className="detail-box">
            <label>Name:</label>
            <p>{name}</p>
          </div>
          <div className="detail-box">
            <label>Username:</label>
            <p>{username}</p>
          </div>
          <div className="detail-box">
            <label>Contact:</label>
            <p>{contact}</p>
          </div>
          <div className="detail-box">
            <label>Email:</label>
            <p>{email}</p>
          </div>
        </div>

        <Modal
          contentClassName="custom-modal"
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          className="custom-modal "
        >
          <div className="modal-header">
            <BsPeopleFill className="profile-icon" />
            <Modal.Title>Edit Profile</Modal.Title>
            <IoClose className="close" size={24} onClick={() => setShowModal(false)} />
          </div>
          <Modal.Body className="modal-body">
            <Row>
              <Col xs={12} md={4} className="text-center">
                <div
                  style={{ width: "100%", height: "100%" }}
                  className="profile-picture"
                  onClick={() =>
                    document.getElementById("profilePictureInputModal")?.click()
                  }
                >
                  {profilePictureBase64 ? (
                    <div className="profile-picture-wrapper">
                      <img
                        src={profilePictureBase64}
                        alt="Profile"
                        className="profile-img-modal"
                      />
                      <div className="profile-picture-overlay">
                        <BsCamera className="camera-icon" />
                      </div>
                    </div>
                  ) : (
                    <BsPersonFill className="profile-placeholder-icon" />
                  )}
                  <input
                    id="profilePictureInputModal"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              </Col>
              <Col xs={12} md={8}>
                <Form>
                  <Form.Group className="input-field">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="input-field">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="input-field">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Group>
                  <Form.Group className="input-field">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      placeholder="Add your new password here"
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="save-button"
              variant="primary"
              onClick={handleEdit}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UserProfile;
