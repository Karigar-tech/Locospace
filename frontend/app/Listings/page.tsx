'use client'
import React, { Suspense, useState, useEffect, use } from 'react';
import { Listing, Thread, Community } from '../../types';
// import { useRouter } from 'next/router';
import ListingBox from '@/components/Listings/ListingBox';
import NavBar from '../../components/NavBar';
import style from "./listings.module.css";
import ToggleButton from "../../components/Listings/Toggle";
import MainBox from '@/components/Threads/MainBox';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import FilterPopup from '@/components/Listings/filterPopup'
import { Button } from 'react-bootstrap'
import Notification from '@/components/Seller/MessageComp';
// Icons
import { FaBed, FaParking, FaRunning, FaTree, FaBuilding, FaHandsHelping, FaShieldAlt, FaMoneyBillWave, FaPaw, FaChild, FaCheck } from 'react-icons/fa';
import { MdOutlineSecurity, MdElderly, MdOutlineHiking } from "react-icons/md";
import { FaPersonSwimming, FaPerson } from "react-icons/fa6";
import { CgGym } from "react-icons/cg";
import { GiBurningRoundShot } from "react-icons/gi";
import { GiPeaceDove } from "react-icons/gi";
import { faMapMarkerAlt, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuthContext } from '@/context/authContext';


const Page = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [community, setCommunity] = useState<string | null>(null);
  const [view, setView] = useState<'listings' | 'threads'>('listings');
  const [search, setSearch] = useState<string | null>(null);
  const [commID, setCommID] = useState<string>('');
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [notification, setNotification] = useState<string | null>(null); 
  const searchParams = useSearchParams();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const router = useRouter();
  // const { threadId } = router.query;

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
  const {authUser ,setAuthUser} = useAuthContext();
  

  const fetchCommunities = async (searchTerm: string) => {
    try {
      const searchQueryString = searchTerm
        ? `search=${encodeURIComponent(searchTerm)}`
        : "";
      console.log("Search Query String:", searchQueryString);
      const token = localStorage.getItem("token");
      setAuthUser(token);
      const response = await fetch(
        `http://localhost:5000/api/community/?${searchQueryString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Community[] = await response.json();
      console.log("Fetched communities:", data);

      if (Array.isArray(data)) {
        setCommunities(data);
      } else {
        console.error("Expected an array but got:", data);
        setCommunities([]);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  useEffect(() => {
    setAuthUser(localStorage.getItem('token'));
    if (!authUser) {
      router.push('/Login'); // Redirect to login page if not authenticated
    }
  }, [authUser, router]);
 
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

      const response = await fetch(`http://localhost:5000/api/listings/listingsearch?${query}`,  {
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

  const UserData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch("http://localhost:5000/api/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
          setCommunity(storedCommunity);
          setListings(data.detailedListings);
          setCommID(data.communityID)

          const userComm = await UserData();
        
          const response2 = await fetch(`http://localhost:5000/api/threads/specificThreads/${data.communityID}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data2 = await response2.json();
          console.log("Data ",data2)
          setThreads(data2);
          
          
          if (userComm && userComm.user.community === data.communityID) {
            setIsJoined(true);
            localStorage.setItem('joinedCommunity', 'true');
          } else {
            setIsJoined(false);
            localStorage.removeItem('joinedCommunity');
          }
        } catch (error) {
          console.error('Error fetching community details:', error);
        }
      };
      fetchCommunityDetails();
    }
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

  const handleJoin = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/community/join-community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ commID }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Error joining community');
      }
      
      if (data.user.community === commID) {
        setIsJoined(true);
        localStorage.setItem('joinedCommunity', 'true');
      } else {
        setIsJoined(false);
        localStorage.removeItem('joinedCommunity');
      }
  
      setNotification(data.message);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setNotification(errorMessage);
      setTimeout(() => setNotification(null), 3000);
    }
  };
  
   useEffect(() => {

    const fetchListings = async () => {
    const keyword = searchParams.get('keyword');
    console.log(keyword)
    
    try {
      const response = await fetch(`http://localhost:5000/api/listings/type?keyword=${keyword}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
       console.log(data)
       setListings(data)
      } else {
        console.error("Error fetching buy listings:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching buy listings:", error);
    }
  }

  fetchListings();
  },[] );

  return (
    <div>
      <NavBar />
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div className={style.gradientBarContainer}>
        <div className={style.gradientBar}></div>
        <ToggleButton view={view} setView={setView} />
      </div>
      <div className = {style.JoinCommButton}>
      <Button
            className={style.JoinButtonComm}
            onClick={handleJoin}
            disabled={isJoined} 
          >
            {isJoined ? (
              <>
                <FaCheck style={{ color: 'white', marginRight: '8px' }} /> Community Joined
              </>
            ) : (
              'Join Community'
            )}
          </Button>
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
                onClick={toggleFilters} 
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
        <div>
          <div className='col'> 
            <h4 className="ml-15 mt-36">
              Threads in {community ? community : 'Community'}
            </h4>
          </div>
        <MainBox threads={threads} commID={commID} /> 
        </div>
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
