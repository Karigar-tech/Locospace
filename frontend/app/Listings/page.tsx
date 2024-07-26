'use client'
import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/LandingNavbar';
import SearchBar from '@/components/Listings/SearchBar';
import { Listing } from '../../types';
import ListingBox from '@/components/Listings/ListingBox';
import NavBar from '../../components/NavBar';
import "../../styles/main.css";

const Page = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [community, setCommunity] = useState<string | null>(null);
  const [view, setView] = useState<'listings' | 'threads'>('listings');

  useEffect(() => {
    const storedCommunity = localStorage.getItem('selectedCommunity');
    if (storedCommunity) {
      setCommunity(storedCommunity);

      const getListings = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/listings/'); // Replace with your actual API endpoint
          const data = await response.json();
          console.log(data);
          setListings(data);
        } catch (error) {
          console.error('Error fetching listings:', error);
        }
      };
      getListings();
    }
  }, []);

  const toggleView = () => {
    setView(view === 'listings' ? 'threads' : 'listings');
  };

  return (
    <div>
      <NavBar />
      <div className="gradient-bar-container">
        <div className="gradient-bar"></div>
        <SearchBar />
      </div>
      <button className='search-bar-container button' onClick={toggleView}>
        {view === 'listings' ? 'Show Threads' : 'Show Listings'}
      </button>
      <h2>{view === 'listings' ? `Listings for ${community ? community : 'All'}` : 'Threads'}</h2>
      {view === 'listings' ? (
        <div className="listings-list">
          {listings.length > 0 ? (
            <ul>
              {listings.map((listing) => (
                <ListingBox key={listing._id} item={listing} />
              ))}
            </ul>
          ) : (
            <p>No listings found</p>
          )}
        </div>
      ) : (
        <div className="threads-list">
          {/* Replace the following with your Threads component or implementation */}
          <p>No threads found</p>
        </div>
      )}
    </div>
  );
};

export default Page;
