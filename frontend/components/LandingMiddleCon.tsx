import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../styles/main.css';
import { useRouter } from 'next/navigation';

const communities = [
  "DHA-1",
  "DHA-2",
  "Bahria Phase 1-6",
  "Bahria Phase 7-9",
  "Gulberg Greens",
  "PWD"
];

const LandingPageComp: React.FC = () => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSell = () =>{
    router.push('/SellerForm')

  };

  return (
    <Container fluid className="landing-container">
      <Row className="position-relative w-100">
        <img src='LandingBackground.png' alt="Landing Background" className="background-image" />
        <Col className="left-half">
          <div className="text-overlay">
            <div className="big-text">Find your Community<br />not just a Property!</div>
            <div className="small-text">Welcome to Locospace, your ultimate destination for finding the perfect home. Whether you're looking to rent or buy, our extensive listings cover everything from cosy apartments to spacious family homes.</div>
            <div className="search-container">
              <div className="buttons-container">
                <Button className='search_buttons' variant="primary">Buy</Button>
                <Button className='search_buttons' variant="primary" onClick ={handleSell}>Sell</Button>
                <Button className='search_buttons' variant="primary">Rent</Button>
              </div>
              <Form>
                <InputGroup className="mb-3">
                  <InputGroup.Text><FontAwesomeIcon icon={faMapMarkerAlt} /></InputGroup.Text>
                  <Form.Control type="text" placeholder="Discover your perfect home" />
                  <Button variant="outline-secondary" onClick={toggleFilters}>
                    <FontAwesomeIcon  icon={faFilter} />
                  </Button>
                  <Button variant="primary" id="button-search">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
                {showFilters && (
                  <Form.Group controlId="filter" className="mt-3">
                    <Form.Control as="select" multiple>
                      <option>idk 1</option>
                      <option>idk 2</option>
                      <option>idk 3</option>
                    </Form.Control>
                  </Form.Group>
                )}
              </Form>
            </div>
          </div>
        </Col>
        <Col className="right-half">
          {/* <img src="landingPageImage.svg" alt="Landing Image" className="landing-image" /> */}
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPageComp;
