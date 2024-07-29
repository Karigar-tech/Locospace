"use client";

import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import UserProfile from '../../components/Profile/UserProfile';
import Footer from '../../components/LandingFooter';
import CardGridComp from '../../components/Profile/ListingCard';
import '../../styles/profile.css';
import { Listing } from '@/types';

const MyProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'listings' | 'threads'>('listings');
  const [listings, setListings] = useState<Listing[]>([]);

  const handleProfileUpdate = (profile: { user: any; listings: Listing[] }) => {
    setListings(profile.listings);
  };
  
  return (
    <div>
      <NavBar />
      <div className='head'>
      </div>
      <UserProfile onProfileUpdate={handleProfileUpdate} />
      <div className="profile-toggle-container">
        <button
          className={`profile-toggle-button ${selectedTab === 'listings' ? 'active' : ''}`}
          onClick={() => setSelectedTab('listings')}
        >
          Listings
        </button>
        <button
          className={`profile-toggle-button ${selectedTab === 'threads' ? 'active' : ''}`}
          onClick={() => setSelectedTab('threads')}
        >
          Threads
        </button>
      </div>
      <div className="content-container">
        {selectedTab === 'listings' ? (
          <div className="listings-content">
            <CardGridComp data={listings} />
          </div>
        ) : (
          <div className="threads-content">Threads Content</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyProfile;
