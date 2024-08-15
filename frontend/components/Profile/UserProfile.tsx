"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import styles from "../../styles/profile.module.css"; // Import CSS Module
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const Data = await response.json();
        setUsername(Data.user.username);
        setName(Data.user.name);
        setEmail(Data.user.email);
        setAddress(Data.user.address);
        setContact(Data.user.contact);
        setProfilePictureBase64(Data.user.profilePicture);
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

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

  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    profilePictureInputRef.current?.click();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className={styles.profileHeader}>
        <h2>User Profile</h2>
        <hr className={styles.headerLine} />
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.profilePicture}>
          {profilePictureBase64 ? (
            <img
              src={profilePictureBase64}
              alt="Profile"
              className={styles.profileImg}
            />
          ) : (
            <BsPersonFill className={styles.profilePlaceholderIcon} />
          )}
          <BsPencilSquare
            className={styles.editIcon}
            onClick={() => setShowModal(true)}
          />
        </div>
        <div className={styles.profileDetails}>
          <div className={styles.detailBox}>
            <label>Name:</label>
            <p>{name}</p>
          </div>
          <div className={styles.detailBox}>
            <label>Username:</label>
            <p>{username}</p>
          </div>
          <div className={styles.detailBox}>
            <label>Contact:</label>
            <p>{contact}</p>
          </div>
          <div className={styles.detailBox}>
            <label>Email:</label>
            <p>{email}</p>
          </div>
        </div>

        <Modal
          contentClassName={styles.customModal}
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          className={styles.customModal}
        >
          <div className={styles.modalHeader}>
            <BsPeopleFill className={styles.profileIcon} />
            <Modal.Title>Edit Profile</Modal.Title>
            <IoClose
              className={styles.close}
              size={24}
              onClick={() => setShowModal(false)}
            />
          </div>
          <Modal.Body className={styles.modalBody}>
            <Row>
              <Col md={4} className="text-center">
                <div
                  style={{ width: "100%", height: "100%" }}
                  className={styles.profilePicture}
                  onClick={handleClick}
                >
                  {profilePictureBase64 ? (
                    <div className={styles.profilePictureWrapper}>
                      <img
                        src={profilePictureBase64}
                        alt="Profile"
                        className={styles.profileImgModal}
                      />
                      <div className={styles.profilePictureOverlay}>
                        <BsCamera className={styles.cameraIcon} />
                      </div>
                    </div>
                  ) : (
                    <BsPersonFill className={styles.profilePlaceholderIcon} />
                  )}
                  <input
                    id="profilePictureInputModal"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    ref={profilePictureInputRef}
                  />
                </div>
              </Col>
              <Col xs={12} md={8}>
                <Form className={styles.info}>
                  <Form.Group className={styles.inputField}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className={styles.inputField}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className={styles.inputField}>
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Group>
                  <Form.Group className={styles.inputField}>
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
              className={styles.saveButton}
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
