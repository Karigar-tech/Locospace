"use client";
import React, { useEffect, useState } from 'react';
import CustomNavBar from '../components/LandingNavbar';
import LandingPageComp from '../components/LandingMiddleCon';
import CardCarouselComp from '../components/LandingCardCarouselComp';
import Footer from '../components/LandingFooter';

const LandingPage: React.FC = () => {
  
  return (
    <div>

      <CustomNavBar />
      <LandingPageComp/>
      <CardCarouselComp />
      <Footer/>
      
    </div>
  );
};

export default LandingPage;
