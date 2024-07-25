'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Col, Form, Row, Modal, InputGroup, FormControl, Nav, Tab } from 'react-bootstrap';
import { Listing, User } from '@/types';
import '../../styles/sellerform.css';
import MapComponent from '@/components/Map/Map';

const SellerForm: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [formData, setFormData] = useState<Listing>({
    ListingPictures: [],
    Description: "",
    location: "",
    bedroom: 0,
    bath: 0,
    kitchen: 0,
    price: 0,
    listing_type: "",
    area: 0,
    preferences: [],
    user: {
      address: "",
      contact: "",
      email: "",
      name: "",
      profilePicture: {
        filePath: "",
        url: "",
      },
    },
  });
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('environment');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [file, setFile] = useState<FileList | null>(null);

  const token = localStorage.getItem('token');
  console.log(token)

  const options = {
    environment: ['Busy', 'Peaceful', 'Green', 'Commercial', 'Supportive', 'Safe', 'Affordable', 'Pet Friendly'],
    facilities: ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Playground'],
    ageGroup: ['Kids', 'Teens', 'Adults', 'Seniors']
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleIncrement = (field: keyof Listing) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: (prevFormData[field] as number) + 1,
    }));
  };

  const handleDecrement = (field: keyof Listing) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: Math.max((prevFormData[field] as number) - 1, 0),
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files);
    }
  };

  const handleHomeIconClick = () => {
    document.getElementById('fileInput')?.click(); 
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

   

    try {
      const response = await fetch('http://localhost:5000/api/listings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Done', data.message);
      
    } catch (error) {
      console.error('Error:', error);
      
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleConfirmSelection = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [activeTab]: selectedOptions,
    }));
    setShowModal(false);
    setSelectedOptions([]);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim().replace(/\s+/g, ' ').toLowerCase(); // Trim and normalize spaces
    setSearchQuery(query);
    setFilteredOptions(
      options[activeTab as keyof typeof options].filter(option =>
        option.toLowerCase().includes(query)
      )
    );
  };
  const handleRemoveEnvironment = (envToRemove: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      preferences: prevFormData.preferences.filter(env => env !== envToRemove)
    }));
  };

  return (
    <div className="seller-form mt-5 mx-auto">
      <h1 className="text-center mb-4">Property Details</h1>
      <Form onSubmit={handleSubmit}>
        <div className="card mb-4 p-3">
          <Row className="align-items-center">
            <Col md={8}>
              <Form.Group>
                <h4>Purpose</h4>
                <div className="d-flex mt-3">
                  <Button
                    className={`me-3 rounded-5 px-4 ${formData.listing_type === 'sell' ? 'active' : ''}`}
                    variant={formData.listing_type === 'sell' ? 'primary' : 'outline-primary'}
                    onClick={() => setFormData(prev => ({ ...prev, listing_type: 'sell' }))}
                  >
                    <img src="/buy-home.png" alt="Icon" className="buy-image me-2" />
                    Sell
                  </Button>
                  <Button
                    className={`ms-3 rounded-5 px-4 ${formData.listing_type === 'rent' ? 'active' : ''}`}
                    variant={formData.listing_type === 'rent' ? 'primary' : 'outline-primary'}
                    onClick={() => setFormData(prev => ({ ...prev, listing_type: 'rent' }))}
                  >
                    <img src="/key.png" alt="Icon" className="key-image me-2" />
                    Rent
                  </Button>
                </div>
              </Form.Group>
            </Col>
            <Col md={4} className="p-3 d-flex justify-content-center align-items-center">
              <Button
                type="button"
                className="icon-button d-flex justify-content-center align-items-center rounded-circle"
                onClick={() => {}} 
              >
                <img src="/home-icon.png" alt="Home Icon" className="icon-image" />
              </Button>
            </Col>
          </Row>
        </div>

        <div className="card mb-4 p-3">
          <Row>
            <Col>
              <Form.Group>
                <h4>Location</h4>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter the Address"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Form.Group>
                <h4>Area Size</h4>
                <Form.Control
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Enter the area size"
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group>
                <h4>Price</h4>
                <Form.Control
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter the price"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <h4>Description</h4>
            <Form.Control
              as="textarea"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              placeholder="Enter property description"
              required
            />
          </Form.Group>
        </div>

        <div className="card mb-4 p-3">
          <Row>
            <Col md={6}>
              <h4>Features</h4>
              <ul className="features-list">
                <li className="features-list-item">
                  <label>Bedrooms:</label>
                  <div className="qty">
                    <span className="minus bg-primary" onClick={() => handleDecrement('bedroom')}>-</span>
                    <input
                      type="text"
                      name="bedroom"
                      value={formData.bedroom}
                      readOnly
                      className="count"
                    />
                    <span className="plus bg-primary" onClick={() => handleIncrement('bedroom')}>+</span>
                  </div>
                </li>
                <li className="features-list-item">
                  <label>Kitchen:</label>
                  <div className="qty">
                    <span className="minus bg-primary" onClick={() => handleDecrement('kitchen')}>-</span>
                    <input
                      type="text"
                      name="kitchen"
                      value={formData.kitchen}
                      readOnly
                      className="count"
                    />
                    <span className="plus bg-primary" onClick={() => handleIncrement('kitchen')}>+</span>
                  </div>
                </li>
                <li className="features-list-item">
                  <label>Bathrooms:</label>
                  <div className="qty">
                    <span className="minus bg-primary" onClick={() => handleDecrement('bath')}>-</span>
                    <input
                      type="text"
                      name="bath"
                      value={formData.bath}
                      readOnly
                      className="count"
                    />
                    <span className="plus bg-primary" onClick={() => handleIncrement('bath')}>+</span>
                  </div>
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <h4>About the environment</h4>
              <div>
                <Button
                  variant="primary"
                  className="btn-sm"
                  onClick={() => { setShowModal(true); setActiveTab('environment'); }}
                >
                  Select Environment
                </Button>
                <div className="selected-options-container">
                  {formData.preferences.map((env, index) => (
                    <span key={index} className="selected-option">
                      {env}
                      <span className="remove-option" onClick={() => handleRemoveEnvironment(env)}>×</span>
                    </span>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>


        <div className="d-flex justify-content-end">
          <Button type="submit" className="me-2 btn-primary rounded-5 px-4">
            Publish
          </Button>
          <Button type="button" variant="primary" className="btn-cancel rounded-5 px-4">
            Cancel
          </Button>
        </div>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Container activeKey={activeTab}>
            <Nav variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="environment" onClick={() => setActiveTab('environment')}>Environment</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="facilities" onClick={() => setActiveTab('facilities')}>Facilities</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ageGroup" onClick={() => setActiveTab('ageGroup')}>Age Group</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="environment">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Search Environment..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                {options.environment.map(option => (
                  <Form.Check
                    key={option}
                    type="checkbox"
                    label={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionSelect(option)}
                  />
                ))}
              </Tab.Pane>
              <Tab.Pane eventKey="facilities">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Search Facilities..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                {options.facilities.map(option => (
                  <Form.Check
                    key={option}
                    type="checkbox"
                    label={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionSelect(option)}
                  />
                ))}
              </Tab.Pane>
              <Tab.Pane eventKey="ageGroup">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Search Age Group..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                {options.ageGroup.map(option => (
                  <Form.Check
                    key={option}
                    type="checkbox"
                    label={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionSelect(option)}
                  />
                ))}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmSelection}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SellerForm;
