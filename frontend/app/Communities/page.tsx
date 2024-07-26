"use client";
import React from 'react';
import NavBar from '../../components/NavBar';
import CommunityBox from '../../components/Communities/CommunityBox';
import '../../styles/main.css';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const communities = [
  { name: "DHA-1", members: 120, listings: 15 },
  { name: "DHA-2", members: 90, listings: 10 },
  { name: "Bahria Phase 1-6", members: 200, listings: 25 },
  { name: "Bahria Phase 7-9", members: 150, listings: 20 },
  { name: "Gulberg Greens", members: 100, listings: 18 },
  { name: "PWD", members: 420, listings: 69 }

];

const CommunitiesPage = () => {
  const router = useRouter();

  const handleCommunityClick = (name: string) => {
    localStorage.setItem('selectedCommunity', name);
    router.push('/Listings');
  };

  return (
    <div>
      <NavBar />
      <div className="gradient-bar-container">
        <div className="gradient-bar"></div>
        <div className='search-bar-container'>
          <Button>Search</Button>
          <input type="text" className='community-search' placeholder='Searchstuff' />
        </div>
      </div>
      <h2 className="ml-15 mt-36">All Communities</h2>
      <div className="community-list">
        {communities.map((community) => (
          <CommunityBox
            key={community.name}
            name={community.name}
            members={community.members}
            listings={community.listings}
            onClick={() => handleCommunityClick(community.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default CommunitiesPage;
