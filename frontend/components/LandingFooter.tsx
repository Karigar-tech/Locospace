'use client'

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light position-relative" style={{ position: 'relative'}}>
      <Container className="py-4">
        <Row className="justify-content-center text-center">
          <Col xs={12} md={6}>
            <h5>Locospace</h5>
            <p>
              Locospace: Your ultimate platform for exploring and managing property listings.
            </p>
            <Button variant="primary" href="/contact" className="rounded me-4">
              Contact Us
            </Button>
          </Col>
        </Row>
      </Container>
      <div className="text-center p-2 bg-light text-dark">
        <span>&copy; {new Date().getFullYear()} Locospace All Rights Reserved</span>
      </div>
      
      {/* Social media icons container */}
      <div style={{
        position: 'absolute', 
        bottom: '10px', 
        right: '10px', 
        display: 'flex', 
        gap: '10px',
        marginRight: '50px'
      }}>
        <a href="https://www.facebook.com" className="mx-2">
          <FontAwesomeIcon icon={faFacebookF} size="sm" style={{ color: 'black', height: '15px' }}/>
        </a>
        <a href="https://www.linkedin.com" className="mx-2">
          <FontAwesomeIcon icon={faLinkedinIn} size="sm" style={{ color: 'black', height: '15px' }} />
        </a>
        <a href="https://www.twitter.com" className="mx-2">
          <FontAwesomeIcon icon={faTwitter} size="sm" style={{ color: 'black', height: '15px' }} />
        </a>
      </div>
      
      {/* Logo container */}
      <div style={{
        position: 'absolute', 
        bottom: '5px', 
        left: '10px', 
        display: 'flex', 
        alignItems: 'center',
        marginLeft: '50px',
        top: '170px'
      }}>
        <img src="/logo.png" alt="Logo" style={{ height: '70px' }} />
      </div>
    </footer>
  );
};

export default Footer;
