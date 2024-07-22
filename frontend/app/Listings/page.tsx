'use client'
import React, { useState, useEffect } from 'react'
import CustomNavbar from '../../components/LandingNavbar';
import SearchBar from '@/components/Listings/SearchBar';

const page = () => {

  const [listings, setListings] = useState([]);

  const getListings = async () => {
    try {
      const response = await fetch('/api/listings'); // Replace with your actual API endpoint
      const data = await response.json();
      setListings(data);
      
    } catch (error) {
      console.error('Error fetching listings:', error);
    }

  }

  useEffect(() => {
    getListings();
  }, []);

  return (
    <div>
      <CustomNavbar/>
      <SearchBar/>
      <div>
        <h2>Listings</h2>
        {listings.length > 0 ?(
          <ul>
            {listings.map( (listing,index) => (
              <li key= {index}>
                {/* {listing.name} */}
                uo
              </li>
            ))}
          </ul>
        ) : (
          <p>No listings found</p>
        )}
      </div>
    </div>
  )
}

export default page
