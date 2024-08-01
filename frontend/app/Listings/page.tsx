'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Listing, User, Thread, Community } from '../../types';
import ListingBox from '@/components/Listings/ListingBox';
import NavBar from '../../components/NavBar';
import "../../styles/main.css";
import '../../styles/profile.css';
import ToggleButton from "../../components/Listings/Toggle";
import MainBox from '@/components/Threads/MainBox';
import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [community, setCommunity] = useState<string | null>(null);
  const [view, setView] = useState<'listings' | 'threads'>('listings');
  const [search, setSearch] = useState<string | null>(null);
  const [commID, setCommID] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      setSearch(searchTerm);
      fetchListings(searchTerm);
    }
  }, [searchParams]);

  const fetchListings = async (searchTerm: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/listings/alllistings?search=${searchTerm}`, {
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
      const fetchCommunityDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/community/${storedCommunity}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log("Community: ", storedCommunity, "Id:", data.communityID);
          setCommID(data.communityID); // Update state
          setCommunity(storedCommunity);
        } catch (error) {
          console.error('Error fetching community details:', error);
        }
      };
      fetchCommunityDetails();
    }
  }, []);

  useEffect(() => {
    console.log("ID Updated: ", commID); // Log updated commID
  }, [commID]);

  useEffect(() => {
    const getThreads = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/threads/allThreads');
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        console.log('Error fetching threads:', error);
      }
    };
    getThreads();
  }, []);

  const toggleView = () => {
    setView(view === 'listings' ? 'threads' : 'listings');
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    fetchListings(searchTerm);
    router.push(`?search=${searchTerm}`);
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
        <MainBox threads={threads} commID={commID} />
      )}
    </div>
  );
};

export default Page;
