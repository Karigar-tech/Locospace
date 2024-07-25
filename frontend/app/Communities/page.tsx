"use client";
import React, { useEffect, useState } from 'react';
import CustomNavBar from '../../components/LandingNavbar';
import CommunityBox from '../../components/Communities/CommunityBox';
import '../../styles/main.css'
import { Button } from 'react-bootstrap';

const hardcodedCommunities = [
    { name: 'DHA-1', members: 150, listings: 20 },
    { name: 'DHA-2', members: 200, listings: 30 },
    { name: 'Bahria Phase 1-6', members: 180, listings: 25 },
    { name: 'Bahria Phase 7-9', members: 220, listings: 35 },
    { name: 'Gulberg Greens', members: 170, listings: 28 },
    
];
const page = () => {
  return (
    <div>
    <CustomNavBar />

        <div className="gradient-bar-container">
            <div className="gradient-bar"></div>
            <div className='search-bar-container'>
                <Button>Search</Button>
                <input type="text" className='community-search' placeholder='Searchstuff'/>
            </div>
        </div>

      
      <div className="p-4 mt-8">
        <h1>All communities</h1>
        {hardcodedCommunities.map((community,index)=>(
            <CommunityBox
            key={index}
            name= {community.name}
            members={community.members}
            listings={community.listings}
            />
        ))}

      </div>
    </div>
  )
}

export default page
