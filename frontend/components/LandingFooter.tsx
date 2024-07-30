'use client'

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light">
      <Container className="py-4">
        <Row>
          <Col md={6}>
            <h5>Locospace</h5>
            <p>
                Locospace: Your ultimate platform for exploring and managing property listings.
            </p>
          </Col>
          <Col md={3}>
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li>Email: idk@gmail.com</li>
              <li>Phone: +1234567890</li>
              <li>
                 <a href="https://www.linkedin.com/company/karigartech/?viewAsMember=true"><FontAwesomeIcon icon={faLinkedin} /></a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="text-center p-3 bg-secondary">
        <span>&copy; {new Date().getFullYear()} Locospace All Rights Reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
