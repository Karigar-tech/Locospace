"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import styles from '../styles/main.module.css';

const CustomNavBar: React.FC = () => {
  return (
    <Navbar expand="lg" style={{ backgroundColor: 'white' }}>
      <Container fluid>
        <Link className={styles.navbarbrandcustom} href="/" passHref>
          <Navbar.Brand>
            <img src="logo.png" width="60" height="60" className="d-inline-block align-text-center" alt="Logo" />
            Locospace 
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Link href="/Login" passHref>
              <Button variant="outline-primary" className={styles.btncustom}>Login</Button>
            </Link>
            <Link href="/Signup" passHref>
              <Button variant="primary" className={styles.btncustomsignup}>Sign Up</Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavBar;
