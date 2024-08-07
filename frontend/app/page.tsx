"use client";

import React, { useEffect, useState } from "react";
import CustomNavBar from "../components/LandingNavbar";
import LandingPageComp from "../components/LandingMiddleCon";
import CardCarouselComp from "../components/LandingCardCarouselComp";
import Footer from "../components/LandingFooter";
import NavBar from "../components/NavBar";

const LandingPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <div>
        {token ? <NavBar /> : <CustomNavBar />}
        <LandingPageComp />
        <CardCarouselComp />
        <Footer />
    </div>
  );
};

export default LandingPage;
