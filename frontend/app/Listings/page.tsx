'use client'
import React, { useState, useEffect } from 'react'
import CustomNavbar from '../../components/LandingNavbar';
import SearchBar from '@/components/Listings/SearchBar';
import {Listing} from '../../types';

const page = () => {

  const [listings, setListings] = useState<Listing[]>([]); 
  const [community, setCommunity]= useState<string | null>(null)

  useEffect(()=>{
    const storedCommunity= localStorage.getItem('selectedCommunity');
    if(storedCommunity){
      // const communityData= JSON.parse(storedCommunity);
      // setCommunity(communityData);
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
  },[]);
  

  useEffect(() => {
    
  }, []);

  return (
    <div>
      <CustomNavbar/>
      <SearchBar/>
      <div>
        <h2>Listings for {community ? community : 'All'}</h2>
        {listings.length > 0 ?(
          <ul>
            {listings.map( (listing,index) => (
              <li key= {index}>
                {listing.location}
                
                <br/>{listing.Description}
                <br/> Bathroom: {listing.bath}
                <br/> Bedroom: {listing.bedroom}
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
