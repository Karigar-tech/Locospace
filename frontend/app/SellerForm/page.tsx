'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Col, Form, Row, Modal, InputGroup, FormControl, Nav, Tab } from 'react-bootstrap';
//Icons 
import { FaBed,FaParking, FaRunning, FaTree, FaBuilding, FaHandsHelping, FaShieldAlt, FaMoneyBillWave, FaPaw , FaChild } from 'react-icons/fa';
import { MdOutlineSecurity , MdElderly, MdOutlineHiking} from "react-icons/md";
import { FaPersonSwimming, FaPerson } from "react-icons/fa6";
import { CgGym } from "react-icons/cg";
import { GiBurningRoundShot } from "react-icons/gi";
import { GiPeaceDove } from "react-icons/gi";
//IconsEnd
import Footer from '../../components/LandingFooter';
import { Listing } from '@/types';
import '../../styles/sellerform.css'; 
import CustomCheckbox from '@/components/customcheckbox';

const SellerForm: React.FC = () => {
  
  const [formData, setFormData] = useState<Listing>({
    _id:0,
    ListingPictures: [],
    adTitle: "",
    Description: "",
    location: "",
    bedroom: 0,
    bath: 0,
    kitchen: 0,
    price: 0,
    listing_type: "",
    areasize: 0,
    areaunit: "",
    area:"",
    preferences: {
      environment: [],
      facilities: [],
      ageGroup: [],
    },
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
  console.log(token);

  const options = {
    environment: ['Busy', 'Peaceful', 'Green', 'Commercial', 'Supportive', 'Safe', 'Affordable', 'Pet Friendly'],
    facilities: ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Playground'],
    ageGroup: ['Kids', 'Teens', 'Adults', 'Seniors']
  };
  const area = ['Marla', 'Kanal', 'Square Feet', 'Acres'];
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleArea = (event:any) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value };
      if (name === 'areaunit' || name === 'areasize') {
        newFormData.area = `${newFormData.areaunit} ${newFormData.areasize}`.trim();
      }
      console.log(newFormData); 
      return newFormData;
    });
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

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('listing_type', formData.listing_type);
    formDataToSubmit.append('price', formData.price.toString());
    formDataToSubmit.append('adTitle', formData.adTitle);
    formDataToSubmit.append('Description', formData.Description);
    formDataToSubmit.append('location', formData.location);
    formDataToSubmit.append('bedroom', formData.bedroom.toString());
    formDataToSubmit.append('bath', formData.bath.toString());
    formDataToSubmit.append('kitchen', formData.kitchen.toString());
    formDataToSubmit.append('area', formData.area.toString());
    formDataToSubmit.append('preferences', JSON.stringify(formData.preferences));
    
    // Append files to formData
    if (file) {
        Array.from(file).forEach((f) => {
            formDataToSubmit.append('ListingPictures', f);
        });
    }

    try {
        const response = await fetch('http://localhost:5000/api/listings/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formDataToSubmit,
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
      preferences: {
        ...prevFormData.preferences,
        [activeTab]: selectedOptions,
      },
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

  const environmentIconMap: Record<string, React.ReactElement> = {
    "Busy": <FaRunning/>,
    "Peaceful": <GiPeaceDove/>,
    "Green": <FaTree/>,
    "Commercial": <FaBuilding/>,
    "Supportive": <FaHandsHelping/>,
    "Safe": <FaShieldAlt/>,
    "Affordable": <FaMoneyBillWave/>,
    "Pet Friendly": <FaPaw/>

  };

   const facilitiesIconMap: Record<string, React.ReactElement> = {
    "Gym": <CgGym/>,
    "Swimming Pool": <FaPersonSwimming/>,
    "Parking": <FaParking/>,
    "Security": <MdOutlineSecurity/>,
    "Playground": <GiBurningRoundShot />
  };

  const ageGroupIconMap: Record<string, React.ReactElement> = {
    "Kids": <FaChild/>,
    "Teens": <FaPerson/>,
    "Adults": <MdOutlineHiking/>,
    "Seniors": <MdElderly />
  };

  const handleRemoveOption = (option: string, category: keyof typeof formData.preferences) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      preferences: {
        ...prevFormData.preferences,
        [category]: prevFormData.preferences[category].filter(o => o !== option),
      },
    }));
  };

  return (
    <div className="container-fluid">
      <img src="/Sellerform.png" alt="Logo" className="img-fluid pb-3" /> 
      <Form onSubmit={handleSubmit} className='mb-5'>
        <div className="card p-3" style={{border:'none'}}>
          <Row className="align-items-center">
            <Col s={6} md={6}>
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
            <Col s={5}  md={5} className="p-3 d-flex justify-content-center align-items-center">
              <Button
                type="button"
                className="icon-button d-flex justify-content-center align-items-center rounded-circle"
                onClick={handleHomeIconClick}
              >
                <img src="/home-icon.png" alt="Home Icon" className="icon-image" />
              </Button>
              <input
                type="file"
                id="fileInput"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={7} md={7}>
              <Form.Group>
                <h4>Location</h4>
                <Form.Control
                  type="textarea"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter the Address"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={5} className='mt-3'>
              <Form.Group>
                <h4>Area Size</h4>
                <Form.Control
                  type="Number" 
                  name="areaunit"
                  value={formData.areaunit}
                  onChange={handleArea}
                  placeholder='Enter Area Size'
                  required
                  className="mb-1 w-50"
                  min="1"
                />
                <Form.Control
                  as="select"
                  name="areasize"
                  value={formData.areasize}
                  onChange={handleArea}
                  required
                  className="w-50"
                >
                  <option value="">Select Area Unit</option>
                  {area.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
              </Form.Control>
              </Form.Group>
            </Col>
            <Col md={5} className='mt-3'>
              <Form.Group>
                <h4>Price</h4>
                <Form.Control
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter the price"
                  required
                  className="w-50"
                />
              </Form.Group>
            </Col>
          </Row>

        </div>
        <div className="card mb-1 p-3" style={{border:'none'}}>
          <Row>
            <Col md={7} className=''>
              <Form.Group>
                <h4>Title</h4>
                <Form.Control
                  type="text"
                  name="adTitle"
                  value={formData.adTitle}
                  onChange={handleChange}
                  placeholder="Enter property title"
                  required
                  className="mb-2 w-100"
                />
              </Form.Group> 
            </Col>
            <Col md={11}>
              <Form.Group>
                <h4>Description</h4>
                <Form.Control
                  as="textarea"
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                  placeholder="Enter property description"
                  required
                  className="w-60"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="card mb-4 p-3" style={{border:'none'}}>
          <Row>
            <Col xs={6} md={6}>
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
            <Col xs={6} md={5}>
              <h4>Preferences</h4>
              <div>
                <Button
                  variant="primary"
                  className="btn-sm"
                  onClick={() => { setShowModal(true); setActiveTab('environment'); }}
                >
                  Select Preferences
                </Button>
                <div className="selected-options-container">
                  {formData.preferences.environment.map((env, index) => (
                    <span key={index}className="selected-option">
                      {environmentIconMap[env]}
                      <span style={{ marginLeft: '5px' }}>{env}</span>
                      <span className="remove-option" onClick={() => handleRemoveOption(env, 'environment')}>×</span>
                    </span>
                  ))}
                  {formData.preferences.facilities.map((fac, index) => (
                    <span key={index} className="selected-option">
                      {facilitiesIconMap[fac]} 
                      <span style={{ marginLeft: '5px' }}>{fac}</span>
                      <span className="remove-option" onClick={() => handleRemoveOption(fac, 'facilities')}>×</span>
                    </span>
                  ))}
                  {formData.preferences.ageGroup.map((age, index) => (
                    <span key={index} className="selected-option">
                      {ageGroupIconMap[age]}
                      <span style={{ marginLeft: '5px' }}>{age}</span>
                      <span className="remove-option" onClick={() => handleRemoveOption(age, 'ageGroup')}>×</span>
                    </span>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div>
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
          <Modal.Title>Select Preferences</Modal.Title>
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
                <InputGroup className="mb-3 mt-3">
                  <FormControl
                    placeholder="Search Environment..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                    <CustomCheckbox
                    options={filteredOptions}
                    IconMap={environmentIconMap}
                    selectedOption={selectedOptions}
                    handleOptionSelect={handleOptionSelect}
                    />
                    <CustomCheckbox
                    options={options.environment}
                    IconMap={environmentIconMap}
                    selectedOption={selectedOptions}
                    handleOptionSelect={handleOptionSelect}
                    />
                
              </Tab.Pane>

              <Tab.Pane eventKey="facilities">
                <InputGroup className="mb-3 mt-3">
                  <FormControl
                    placeholder="Search Facilities..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(option => (
                    <Form.Check
                      key={option}
                      type="checkbox"
                      label={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionSelect(option)}
                    />
                  ))
                ) : (
                  options.facilities.map(option => (
                    <Form.Check style={{padding:'10px', border:'1px solid #219bff' , borderRadius:'5px'}}
                      key={option}
                      type="checkbox"
                      label={
                        <>
                        {facilitiesIconMap[option]}
                        <span style={{ marginLeft: '10px' }}>{option}</span>
                      </>
                      }
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionSelect(option)}
                    />
                  ))
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="ageGroup">
                <InputGroup className="mb-3 mt-3">
                  <FormControl
                    placeholder="Search Age Group..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(option => (
                    <Form.Check 
                      key={option}
                      type="checkbox"
                      label={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionSelect(option)}
                    />
                  ))
                ) : (
                  options.ageGroup.map(option => (
                    <Form.Check style={{padding:'10px', border:'1px solid #219bff' , borderRadius:'5px'}}
                      
                      key={option}
                      type="checkbox"
                      label={
                        <>
                        {ageGroupIconMap[option]}
                        <span style={{ marginLeft: '10px' }}>{option}</span>
                        </>
                      }
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionSelect(option)}
                    />
                  ))
                )}
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
