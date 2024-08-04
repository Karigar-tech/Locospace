'use client'
import React, { Suspense, useState, useEffect } from 'react';
import { Listing, Thread } from '../../types';
import ListingBox from '@/components/Listings/ListingBox';
import NavBar from '../../components/NavBar';
import style from "./listings.module.css";
import ToggleButton from "../../components/Listings/Toggle";
import MainBox from '@/components/Threads/MainBox';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import FilterPopup from '@/components/Listings/filterPopup'
// Icons
import { FaBed, FaParking, FaRunning, FaTree, FaBuilding, FaHandsHelping, FaShieldAlt, FaMoneyBillWave, FaPaw, FaChild } from 'react-icons/fa';
import { MdOutlineSecurity, MdElderly, MdOutlineHiking } from "react-icons/md";
import { FaPersonSwimming, FaPerson } from "react-icons/fa6";
import { CgGym } from "react-icons/cg";
import { GiBurningRoundShot } from "react-icons/gi";
import { GiPeaceDove } from "react-icons/gi";

const Page = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [community, setCommunity] = useState<string | null>(null);
  const [view, setView] = useState<'listings' | 'threads'>('listings');
  const [search, setSearch] = useState<string | null>(null);
  const [commID, setCommID] = useState<string>('');
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false); // State to manage filter popup visibility
  const router = useRouter();
  const searchParams = useSearchParams();
  const environmentIconMap: Record<string, React.ReactElement> = {
    "Busy": <FaRunning />,
    "Peaceful": <GiPeaceDove />,
    "Green": <FaTree />,
    "Commercial": <FaBuilding />,
    "Supportive": <FaHandsHelping />,
    "Safe": <FaShieldAlt />,
    "Affordable": <FaMoneyBillWave />,
    "Pet Friendly": <FaPaw />
  };
  
  const facilitiesIconMap: Record<string, React.ReactElement> = {
    "Gym": <CgGym />,
    "Swimming Pool": <FaPersonSwimming />,
    "Parking": <FaParking />,
    "Security": <MdOutlineSecurity />,
    "Playground": <GiBurningRoundShot />
  };
  
  const ageGroupIconMap: Record<string, React.ReactElement> = {
    "Kids": <FaChild />,
    "Teens": <FaPerson />,
    "Adults": <MdOutlineHiking />,
    "Seniors": <MdElderly />
  };

  useEffect(() => {
    const searchTerm = searchParams.get('search');
    const environment = searchParams.get('environment');
    const facilities = searchParams.get('facilities');
    const ageGroup = searchParams.get('ageGroup');

    if (searchTerm) {
      setSearch(searchTerm);
    }


    fetchListings(searchTerm, community, environment, facilities, ageGroup);
  }, [searchParams]);

  const fetchListings = async (searchTerm: string | null, communityParam: string | null, environment: string | null, facilities: string | null, ageGroup: string | null) => {
    const token = localStorage.getItem('token');
    try {
      const query = new URLSearchParams({
        search: searchTerm || '',
        community: communityParam || '',
        environment: environment || '',
        facilities: facilities || '',
        ageGroup: ageGroup || ''
      }).toString();

      const response = await fetch(`http://localhost:5000/api/listings/listingserach?${query}`,  {
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
          setCommID(data.communityID);
          setCommunity(storedCommunity);
          setListings(data.detailedListings);
        } catch (error) {
          console.error('Error fetching community details:', error);
        }
      };
      fetchCommunityDetails();
    }
  }, []);

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
    fetchListings(searchTerm, community, null, null, null);
    router.push(`?search=${searchTerm}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleApplyFilters = (filters: {
    community: string;
    environments: string[];
    facilities: string[];
    ageGroups: string[];
  }) => {
    setSelectedEnvironments(filters.environments);
    setSelectedFacilities(filters.facilities);
    setSelectedAgeGroups(filters.ageGroups);
    fetchListings(search, community, filters.environments.join(','), filters.facilities.join(','), filters.ageGroups.join(','));
  };


  return (
    <div>
      <NavBar />
      <div className={style.gradientBarContainer}>
        <div className={style.gradientBar}></div>
        <ToggleButton view={view} setView={setView} />
      </div>
      
      {view === 'listings' && (
        <div className={style.upperContainer} style={{ width: '90%' }}>
          <SearchBar onSearch={handleSearch} />
          <div className={style.rowListings}>
            <div className="col">
              <h4 className="ml-15 mt-36">
                Listings in {community ? community : 'Community'}
              </h4>
              <p style={{ color: 'grey', fontFamily: 'Source Sans Pro' }}>
              {listings?.length || 0} {listings?.length === 1 ? "property" : "properties"}
              </p>
            </div>
            
            <div className="col">
            <Image 
                src='/Slider.svg' 
                width={40} 
                height={40} 
                alt="Slider" 
                onClick={toggleFilters} // Open filter popup when clicked
                style={{ cursor: 'pointer' }} 
              />
            </div>
          </div>
        </div>
      )}
      {view === 'listings' ? (
        <div className={style.scrollableContainer}>
          <div className={style.listingsGrid}>
            {(listings?.length ?? 0) > 0 ? (
              listings.map((listing) => (
                <ListingBox key={listing._id} item={listing} />
              ))
            ) : (
              <p>No listings found</p>
            )}
          </div>
        </div>
      ) : (
        <MainBox threads={threads} commID={commID} /> 
      )}
      <FilterPopup
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        community={community || ''}
        environmentIconMap={environmentIconMap}
        facilitiesIconMap={facilitiesIconMap}
        ageGroupIconMap={ageGroupIconMap}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

const ListingsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Page />
  </Suspense>
);

export default ListingsPage;
