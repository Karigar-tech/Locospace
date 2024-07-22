'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Col, Form, Row, Modal, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import '../../styles/sellerform.css';

interface FormData {
  location: string;
  purpose: string;
  price: string;
  areaSize: string;
  bedrooms: number;
  bathrooms: number;
  kitchen: number;
  propertyDescription: string;
  environment: string;
}

const SellerForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    location: '',
    purpose: '',
    price: '',
    areaSize: '',
    bedrooms: 0,
    bathrooms: 0,
    kitchen: 0,
    propertyDescription: '',
    environment: '',
  });

  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEnvironments, setFilteredEnvironments] = useState(['Busy', 'Peaceful', 'Green', 'Quiet', 'Urban']);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleIncrement = (field: keyof FormData) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: (prevFormData[field] as number) + 1,
    }));
  };

  const handleDecrement = (field: keyof FormData) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: Math.max((prevFormData[field] as number) - 1, 0),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Handle form submission logic here
  };

  const handleEnvironmentSelect = (env: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      environment: env,
    }));
    setShowEnvironmentModal(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredEnvironments(
      ['Busy', 'Peaceful', 'Green', 'Quiet', 'Urban'].filter(env => env.toLowerCase().includes(query))
    );
  };

  return (
    <div className="seller-form mt-5 mx-auto">
      <h1 className="text-center mb-4">Property Details</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3 align-items-center">
          <Col md={8}>
            <Form.Group>
              <h4>Purpose</h4>
              <div className="d-flex mt-3">
                <Button
                  className={`me-3 rounded-5 px-4 ${formData.purpose === 'sell' ? 'active' : ''}`}
                  variant={formData.purpose === 'sell' ? 'primary' : 'outline-primary'}
                  onClick={() => setFormData(prev => ({ ...prev, purpose: 'sell' }))}
                >
                  Sell
                </Button>
                <Button
                  className={`ms-3 rounded-5 px-4 ${formData.purpose === 'rent' ? 'active' : ''}`}
                  variant={formData.purpose === 'rent' ? 'primary' : 'outline-primary'}
                  onClick={() => setFormData(prev => ({ ...prev, purpose: 'rent' }))}
                >
                  Rent
                </Button>
              </div>
            </Form.Group>
          </Col>
          <Col md={4} className="p-3 d-flex justify-content-center align-items-center">
            <div className="icon-container rounded-circle">
              <img src="/home-icon.png" alt="Icon" className="icon-image" />
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={4}>
            <Form.Group>
              <h4>Location</h4>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <Form.Group>
              <h4>Area Size</h4>
              <Form.Control
                type="text"
                name="areaSize"
                value={formData.areaSize}
                onChange={handleChange}
                className="short-input"
                required
              />
            </Form.Group>
          </Col>
          <Col xs={6}>
            <Form.Group>
              <h4>Price</h4>
              <Form.Control
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="short-input"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group>
          <h4>Description</h4>
          <Form.Control
            as="textarea"
            name="propertyDescription"
            value={formData.propertyDescription}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <h4 className="mt-4">Features</h4>
        <ul className="features-list">
          <li className="features-list-item">
            <label>Bedrooms:</label>
            <div className="counter-container">
              <Button variant="outline-secondary" onClick={() => handleDecrement('bedrooms')}>-</Button>
              <Form.Control
                type="text"
                name="bedrooms"
                value={formData.bedrooms}
                readOnly
                className="counter-input"
              />
              <Button variant="outline-secondary" onClick={() => handleIncrement('bedrooms')}>+</Button>
            </div>
          </li>
          <li className="features-list-item">
            <label>Kitchen:</label>
            <div className="counter-container">
              <Button variant="outline-secondary" onClick={() => handleDecrement('kitchen')}>-</Button>
              <Form.Control
                type="text"
                name="kitchen"
                value={formData.kitchen}
                readOnly
                className="counter-input"
              />
              <Button variant="outline-secondary" onClick={() => handleIncrement('kitchen')}>+</Button>
            </div>
          </li>
          <li className="features-list-item">
            <label>Bathrooms:</label>
            <div className="counter-container">
              <Button variant="outline-secondary" onClick={() => handleDecrement('bathrooms')}>-</Button>
              <Form.Control
                type="text"
                name="bathrooms"
                value={formData.bathrooms}
                readOnly
                className="counter-input"
              />
              <Button variant="outline-secondary" onClick={() => handleIncrement('bathrooms')}>+</Button>
            </div>
          </li>
        </ul>

        <Form.Group className="mt-4">
          <h4>Environment</h4>
          <div className="d-flex align-items-center">
            <span className="me-3">{formData.environment || 'Select an environment'}</span>
            <Button variant="outline-secondary" onClick={() => setShowEnvironmentModal(true)}>
              <i className="bi bi-plus"></i>
            </Button>
          </div>
        </Form.Group>

        <Row className="mb-3">
          <Col className="text-center">
            <Button type="submit" variant="primary" className="rounded-5 px-4 me-2">
              Publish
            </Button>
            <Button variant="secondary" className="rounded-5 px-4 ms-2">
              Cancel
            </Button>
          </Col>
        </Row>

        <Modal show={showEnvironmentModal} onHide={() => setShowEnvironmentModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select Environment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>
            <ul className="list-group">
              {filteredEnvironments.map((env) => (
                <li
                  key={env}
                  className="list-group-item"
                  onClick={() => handleEnvironmentSelect(env)}
                  style={{ cursor: 'pointer' }}
                >
                  {env}
                </li>
              ))}
            </ul>
          </Modal.Body>
        </Modal>
      </Form>
    </div>
  );
};

export default SellerForm;
