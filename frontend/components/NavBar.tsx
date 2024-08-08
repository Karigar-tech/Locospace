"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import useAuthStore from "../authStore";
import { useRouter } from "next/navigation";
import styles from '../styles/main.module.css';

const NavBar: React.FC = () => {
  const router = useRouter();
  const { token, logout } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    console.log("Logged out. Redirecting to home...");
    router.replace("/");
    // window.location.href = '/';
  };
 
  return (
    <Navbar expand="lg" style={{ backgroundColor: "white" }}>
      <Container fluid>
        <Link className={styles.navbarbrandcustom} href="/" passHref>
          <Navbar.Brand className={styles.navbartext}>
            <img
              src="logo.png"
              width="60"
              height="60"
              className="d-inline-block align-text-center"
              alt="Logo"
            />
            Locospace
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto navv">
            <Link href="/Communities" >
              <div>
              <Button variant="outline-primary" className={styles.navbarbtncustom}>
                Communities
                </Button>
              </div>
            </Link>
            <Link href="/Profile" passHref>
              <Button variant="outline-secondary" className={styles.navbarbtncustom}>
                Profile
              </Button>
            </Link>
            <Link href="/Chatting" passHref>
              <Button variant="outline-secondary" className={styles.navbarbtncustom}>
                Chat
              </Button>
            </Link>
            <Button
              variant="primary"
              className={styles.btncustomsignup}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
