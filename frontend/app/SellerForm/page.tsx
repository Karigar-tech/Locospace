'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Col, Form, Row, Modal, InputGroup, FormControl } from 'react-bootstrap';
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
  environment: string[];
  proofOfOwnership?: File; // Added for file upload
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
    environment: [],
  });

  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEnvironments, setFilteredEnvironments] = useState([
    'Busy', 'Peaceful', 'Green', 'Commercial', 'Supportive', 'Safe', 'Affordable', 'Pet Friendly'
  ]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

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
    setSelectedEnvironments(prev =>
      prev.includes(env) ? prev.filter(e => e !== env) : [...prev, env]
    );
  };

  const handleConfirmEnvironmentSelection = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      environment: selectedEnvironments,
    }));
    setShowEnvironmentModal(false);
  };

  const handleCancelEnvironmentSelection = () => {
    setSelectedEnvironments([]);
    setShowEnvironmentModal(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim().replace(/\s+/g, ' ').toLowerCase(); // Trim and normalize spaces
    setSearchQuery(query);
    setFilteredEnvironments(
      ['Busy', 'Peaceful', 'Green', 'Commercial', 'Supportive', 'Safe', 'Affordable', 'Pet Friendly'].filter(env =>
        env.toLowerCase().includes(query)
      )
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement; // Cast target to HTMLInputElement
    if (inputElement.files && inputElement.files.length > 0) {
      setFormData(prevFormData => ({
        ...prevFormData,
        proofOfOwnership: inputElement.files[0], // Update proofOfOwnership in formData
      }));
      setFile(inputElement.files[0]); // Store the file in local state
    }
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
                    className={`me-3 rounded-5 px-4 ${formData.purpose === 'sell' ? 'active' : ''}`}
                    variant={formData.purpose === 'sell' ? 'primary' : 'outline-primary'}
                    onClick={() => setFormData(prev => ({ ...prev, purpose: 'sell' }))}
                  >
                    <img src="/buy-home.png" alt="Icon" className="buy-image me-2" />
                    Sell
                  </Button>
                  <Button
                    className={`ms-3 rounded-5 px-4 ${formData.purpose === 'rent' ? 'active' : ''}`}
                    variant={formData.purpose === 'rent' ? 'primary' : 'outline-primary'}
                    onClick={() => setFormData(prev => ({ ...prev, purpose: 'rent' }))}
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
                  onClick={() => {}} // No functionality
  >
                 <img src="/home-icon.png" alt="Home Icon" className="icon-image" />
                 </Button>
            </Col>

          </Row>
        </div>

        <div className="card mb-4 p-3">
          <Row>
            <Col xs={12} md={4}>
              <Form.Group>
                <h4>Location</h4>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter the property location"
                  required
                  className="wide-input"
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
                  name="areaSize"
                  value={formData.areaSize}
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
              name="propertyDescription"
              value={formData.propertyDescription}
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
                    <span className="minus bg-primary" onClick={() => handleDecrement('bedrooms')}>-</span>
                    <input
                      type="text"
                      name="bedrooms"
                      value={formData.bedrooms}
                      readOnly
                      className="count"
                    />
                    <span className="plus bg-primary" onClick={() => handleIncrement('bedrooms')}>+</span>
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
                    <span className="minus bg-primary" onClick={() => handleDecrement('bathrooms')}>-</span>
                    <input
                      type="text"
                      name="bathrooms"
                      value={formData.bathrooms}
                      readOnly
                      className="count"
                    />
                    <span className="plus bg-primary" onClick={() => handleIncrement('bathrooms')}>+</span>
                  </div>
                </li>
              </ul>
            </Col>

            <Col md={6}>
              <h4>Environment</h4>
              <Button variant="outline-primary" onClick={() => setShowEnvironmentModal(true)} className="mb-3">
                + Add Environment
              </Button>
              {formData.environment.length > 0 && (
                <ul className="selected-environments">
                  {formData.environment.map((env, index) => (
                    <li key={index} className="environment-item">
                      {env}
                    </li>
                  ))}
                </ul>
              )}
            </Col>
          </Row>

          
        </div>
        <div className="card mb-4 p-3 proof-of-ownership">
  <Row>
    <Col md={12}>
      <Form.Group>
        <h4>Proof of Ownership</h4>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="form-control-file"
        />
        {file && (
          <div className="file-preview mt-3">
            <p>Selected File: {file.name}</p>
            <img src={URL.createObjectURL(file)} alt="Preview" />
          </div>
        )}
      </Form.Group>
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

      <Modal show={showEnvironmentModal} onHide={() => setShowEnvironmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Environments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search environments"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </InputGroup>
          <ul className="list-group">
            {filteredEnvironments.map(env => (
              <li
                key={env}
                className={`list-group-item ${selectedEnvironments.includes(env) ? 'active' : ''}`}
                onClick={() => handleEnvironmentSelect(env)}
              >
                {env}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmEnvironmentSelection}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SellerForm;
