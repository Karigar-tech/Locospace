"use client";

import React, { useEffect, useState } from 'react';
import CustomNavBar from '../components/LandingNavbar';
import LandingPageComp from '../components/LandingMiddleCon';
import CardCarouselComp from '../components/LandingCardCarouselComp';
import Footer from '../components/LandingFooter';
import NavBar from '../components/NavBar';

const LandingPage: React.FC = () => {
  const [tokenExists, setTokenExists] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    
    setTokenExists(token !== null);
  }, [token]);

  useEffect(() => {
    
    if (tokenExists === false) {
     
    }
  }, [tokenExists]);

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    window.location.reload(); 
  };

  if (tokenExists === null) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      {tokenExists ? <NavBar /> : <CustomNavBar />}
      <LandingPageComp />
      <CardCarouselComp />
      <Footer />
    </div>
  );
};

export default LandingPage;
