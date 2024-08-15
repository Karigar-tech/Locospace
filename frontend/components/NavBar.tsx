"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import useAuthStore from "../authStore";
import { useRouter ,usePathname } from "next/navigation";

import styles from '../styles/main.module.css';
const NavBar: React.FC = () => {
  const router = useRouter();
  const url = usePathname();
  const { token, logout } = useAuthStore();

  const isActive = (pathname: string) => url === pathname;


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
          <Link href="/Communities" passHref>
            <Button
              variant="link"
              className={`${styles.navbarbtncustom} ${isActive('/Communities') ? styles.activeLink : 'Dark'}`}
            >
              Communities
            </Button>
          </Link>
            <Link href="/Profile" passHref>
              <Button 
              variant="link" 
              className={`${styles.navbarbtncustom} ${isActive('/Profile') ? styles.activeLink: ''}`}>
              Profile
              </Button>
            </Link>
            <Link href="/Chatting" passHref>
              <Button variant="link" 
              className={`${styles.navbarbtncustom} ${isActive('/Chatting') ? styles.activeLink: ''}`}
              >
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
