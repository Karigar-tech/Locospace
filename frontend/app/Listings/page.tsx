'use client';

import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/LandingNavbar';
import SearchBar from '@/components/SearchBar';
import Image from 'next/image';
import { Listing } from '../../types';
import { Button } from 'react-bootstrap';
import ListingBox from '@/components/Listings/ListingBox';
import NavBar from '../../components/NavBar';
import "../../styles/main.css";
import '../../styles/profile.css';
import ToggleButton from "../../components/Listings/Toggle";
import MainBox from '@/components/Threads/MainBox';
import { useRouter, useSearchParams } from 'next/navigation';
import { faMapMarkerAlt, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Thread {
  _id: string;
  user_id: string
  community_id: string;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
  username: string;
}

const Page = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [community, setCommunity] = useState<string | null>(null);
  const [view, setView] = useState<'listings' | 'threads'>('listings');
  const [keyword, setKeyword] = useState<string | null>(null)
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword) {
      setKeyword(keyword);
      fetchListings(keyword);
    }
  }, [searchParams]); 

  // const addThread = (title: string, username: string) => {
  //   setThreads(prevThreads => [...prevThreads, {th}]);
  // };

  const fetchListings = async (keyword: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/listings/alllistings?keyword=${keyword}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    const storedCommunity = localStorage.getItem('selectedCommunity');
    const token = localStorage.getItem('token');
    
    if (storedCommunity && token) {
      setCommunity(storedCommunity);
      const fetchCommunityDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/community/${storedCommunity}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log(data);
          if (data.detailedListings) {
            setListings(data.detailedListings);
          } else {
            console.error('No listings found for this community');
            setListings([]);
          }
        } catch (error) {
          console.error('Error fetching community details:', error);
        }
      };
      fetchCommunityDetails();
    }
  }, []);

  useEffect(() => {
    console.log('here');
    const getThreads = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/threads/allThreads'); // Replace
        const data = await response.json();
        console.log(response, "Hello", data);
        setThreads(data);
      } catch (error) {
        console.log("Error fetching threads: ", error);
      }
    };
    getThreads();
  }, []);

  const toggleView = () => {
    setView(view === 'listings' ? 'threads' : 'listings');
  };

  const handleSearch = (searchTerm: string) => {
    setKeyword(searchTerm);
    fetchListings(searchTerm);
    router.push(`?keyword=${searchTerm}`);
  };

  return (
    <div>
      <NavBar />
      <div className="gradient-bar-container">
        <div className="gradient-bar"></div>
        <ToggleButton view={view} setView={setView} />
      </div>
      {view === 'listings' && (
        <div className="upper-container" style={{ width: '90%' }}>
          <div className="row">
            
              <SearchBar onSearch={handleSearch} />

          </div>
          <div className="row-listings">
            <div className="col">
              <h4 className="ml-15 mt-36" style={{ fontFamily: 'Source Sans Pro' }}>
                Listings for {community ? community : 'All'}
              </h4>
              <p style={{ color: 'grey', fontFamily: 'Source Sans Pro' }}>
                {listings.length} properties
              </p>
            </div>
          
            <div className="col">
              <Image src='/Slider.svg' width={40} height={40} alt="Slider" />
            </div>
          </div>
        </div>
      )}
      
      {view === 'listings' ? (
        <div className="listings-grid">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <ListingBox key={listing._id} item={listing} />
            ))
          ) : (
            <p>No listings found</p>
          )}
        </div>
      ) : (
        <MainBox threads={threads} />
      )}
    </div>
  );
};

export default Page;
