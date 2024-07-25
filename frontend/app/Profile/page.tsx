"use client";

import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import UserProfile from '../../components/Profile/UserProfile';
import Footer from '../../components/LandingFooter';
import '../../styles/profile.css';

const MyProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'listings' | 'threads'>('listings');

  return (
    <div>
      <NavBar />
      <div className='head'>
      </div>
      <UserProfile />
      <div className="toggle-container">
        <button
          className={`toggle-button ${selectedTab === 'listings' ? 'active' : ''}`}
          onClick={() => setSelectedTab('listings')}
        >
          Listings
        </button>
        <button
          className={`toggle-button ${selectedTab === 'threads' ? 'active' : ''}`}
          onClick={() => setSelectedTab('threads')}
        >
          Threads
        </button>
      </div>
      <div className="content-container">
        {selectedTab === 'listings' ? (
          <div className="listings-content">Listings Kaafi zahda??</div>
        ) : (
          <div className="threads-content">Threads Content</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyProfile;
