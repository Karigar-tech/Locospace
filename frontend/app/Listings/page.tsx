'use client'
import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/LandingNavbar';
import SearchBar from '@/components/Listings/SearchBar';
import { Listing } from '../../types';
import { Button } from 'react-bootstrap';
import ListingBox from '@/components/Listings/ListingBox';
import NavBar from '../../components/NavBar';
import "../../styles/main.css";
import '../../styles/profile.css';
import ToggleButton from "../../components/Listings/Toggle"
import MainBox from '@/components/Threads/MainBox';

const Page = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [community, setCommunity] = useState<string | null>(null);
  const [view, setView] = useState<'listings' | 'threads'>('listings');
  const [threads, setThreads]=  useState<string[]>(
    ["Thread 1: Power outage",
     "Thread 2: Communal gathering"
    ]);

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
          {/* <Button>Search</Button> */}
          <ToggleButton view={view} setView={setView} />
          {/* <input type="text" className='community-search' placeholder='Searchstuff' /> */}
       
      </div>

        
      
      <h2 className='p-4 ml-4'>{view === 'listings' ? `Listings for ${community ? community : 'All'}` : `Threads for ${community ? community : 'All'}`} </h2>
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
          <MainBox/>
          {threads.length> 0 ? (
            <ul>
                {threads.map((thread, index) => (
                  <li key={index}>{thread}</li>
                ))}
            </ul>

          ): (
            <p>No threads found</p>
          )}
          
        </div>
  
      )}
    </div>
  );
};

export default Page;
