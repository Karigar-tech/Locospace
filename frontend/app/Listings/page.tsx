'use client'
import React, { useState, useEffect } from 'react'
import CustomNavbar from '../../components/LandingNavbar';
import SearchBar from '@/components/Listings/SearchBar';
import {Listing} from '../../types';
const page = () => {

  const [listings, setListings] = useState<Listing[]>([]); 

  const getListings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/listings/'); // Replace with your actual API endpoint
      const data = await response.json();
      console.log(data);
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
                {listing.Description}
                <br/> Bathroom: {listing.bathrooms}
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
