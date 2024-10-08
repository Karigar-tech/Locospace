import React from 'react';
import Link from 'next/link';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import '../../styles/main.css';

const ProfileBar: React.FC = () => {
  return (
    <Navbar expand="lg" style={{ backgroundColor: 'white' }}>
      <Container fluid>
        <Link className="navbar-brand-custom" href="/" passHref>
          <Navbar.Brand>
            <img src="logo.png" width="60" height="60" className="d-inline-block align-text-center" alt="Logo" />
            Locospace
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            
            <Link href="/Login" passHref>
              <Button variant="outline-primary" className="btn-custom">Logout</Button>
            </Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ProfileBar;
