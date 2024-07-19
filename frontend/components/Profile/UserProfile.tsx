import React, { useState, useEffect } from 'react';
import { Modal, Button, Form,  Row, Col  } from 'react-bootstrap';
import '../../styles/profile.css'; // Adjust path based on your folder structure
import useAuthStore from '../../authStore';
import { BsPencilSquare, BsPersonFill, BsPeopleFill   } from 'react-icons/bs';

const UserProfile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureBase64, setProfilePictureBase64] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/myprofile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const Data = await response.json();
        setUsername(Data.username);
        setPassword(Data.password);
        setName(Data.name);
        setEmail(Data.email);
        setAddress(Data.address);
        setContact(Data.contact);
        if (Data.profilePicture) {
          setProfilePictureBase64(`data:${Data.profilePicture.contentType};base64,${Data.profilePicture}`);
        }
      } else {
        console.log('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('contact', contact);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await fetch('http://localhost:5000/api/edit', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Profile updated successfully');
        getData();
        setShowModal(false);
      } else {
        console.log('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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
  }, [token]);

  return (
    <div>
    <div className="profile-header">
        <h2>User Profile</h2>
        <hr className="header-line" />
      </div>
    <div className="profile-container">
      <div className="profile-picture">
        {profilePictureBase64 ? (
          <img src={profilePictureBase64} alt="Profile" className="profile-img" />
        ) : (
          <BsPersonFill className="profile-placeholder-icon" />
        )}
        <BsPencilSquare className="edit-icon" onClick={() => setShowModal(true)} />
      </div>
      <div className="profile-details">
        <div className="detail-box">
          <label>Name:</label>
          <p>{name}</p>
        </div>
        <div className="detail-box">
          <label>Email:</label>
          <p>{email}</p>
        </div>
        <div className="detail-box">
          <label>Address:</label>
          <p>{address}</p>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="custom-modal">
        <Modal.Header className="modal-header" closeButton>
          <BsPeopleFill  className="profile-icon" /> 
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Row className="px-3">
            <Col xs={6} className="mb-3 mr-4">
              <div style = {{width: "100%", height: "100%"}}className="profile-picture" onClick={() => document.getElementById('profilePictureInputModal')?.click()}>
              {profilePictureBase64 ? (
                  <img src={profilePictureBase64} alt="Profile" className="profile-img" />
                ) : (
                  <BsPersonFill className="profile-placeholder-icon" />
                )}
                <input
                  id="profilePictureInputModal"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </Col>
            <Col xs={6} className="mb-3 mr-4">
              <Form.Group controlId="formNameModal">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>
              <Form.Group controlId="formEmailModal">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: '1px solid #ced4da', padding: '8px' }}
                />
              </Form.Group>
              <Form.Group controlId="formAddressModal">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>
              <Form.Group controlId="formContactModal">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>
              <Form.Group controlId="formPasswordModal">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className = "save-button"variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default UserProfile;
