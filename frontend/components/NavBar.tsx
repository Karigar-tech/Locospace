import React from 'react';
import Link from 'next/link';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import useAuthStore from '../authStore';
import { useRouter } from 'next/navigation';
import '../styles/main.css';

const NavBar: React.FC = () => {
    const router = useRouter();
    const { token, logout } = useAuthStore();

    const handleLogout = () => {
        
        localStorage.removeItem('token');
        logout(); // Clear the token
        console.log('Logged out. Redirecting to home...');
        router.push('/'); // Redirect to home
      };

  return (
    <Navbar expand="lg" style={{ backgroundColor: 'white' }}>
      <Container fluid>
        <Link className="navbar-brand-custom" href="/" passHref>
          <Navbar.Brand className='navbar-text'>
            <img src="logo.png" width="60" height="60" className="d-inline-block align-text-center" alt="Logo" />
            Locospace
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto navv">
            <Link href="/Communities" passHref>
              <Button variant="outline-primary" className="navbar-btn-custom">Communities</Button>
            </Link>
            <Link href="/Profile" passHref>
              <Button variant="outline-secondary" className="navbar-btn-custom">Profile</Button>
            </Link>
            <Button variant="primary" className="btn-custom-signup" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
