'use client'
import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/LandingNavbar';
import SearchBar from '@/components/Listings/SearchBar';
import { Listing } from '../../types';
import ListingBox from '@/components/Listings/ListingBox';
import NavBar from '../../components/NavBar';

const Page = () => {
  const [listings, setListings] = useState<Listing[]>([]); 
  const [community, setCommunity] = useState<string | null>(null);

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

  return (
    <div>
      <NavBar />
      <SearchBar />
      <div className="community-list">
        <h2>Listings for {community ? community : 'All'}</h2>
        {listings.length > 0 ? (
          <ul>
            {listings.map((listing, index) => (
              <ListingBox key={index} item={listing} />
            ))}
          </ul>
        ) : (
          <p>No listings found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
