"use client";
import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import CommunityBox from '../../components/Communities/CommunityBox';
import '../../styles/main.css';
import { Button } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { Community } from '../../types';

const CommunitiesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const token = localStorage.getItem('token');

  const fetchCommunities = async (queryString: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/community?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data: Community[] = await response.json();
      console.log('Fetched communities:', data);
      if (Array.isArray(data)) {
        setCommunities(data);
      } else {
        console.error('Expected an array but got:', data);
        setCommunities([]);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (keyword) {
      params.set('keyword', keyword);
    } else {
      params.delete('keyword');
    }
    fetchCommunities(params.toString());
  }, [searchParams, keyword]);

  const handleCommunityClick = (name: string) => {
    localStorage.setItem('selectedCommunity', name);
    router.push('/Listings');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div>
      <NavBar />
      <div className="gradient-bar-container">
        <div className="gradient-bar"></div>
        <div className='search-bar-container'>
          <Button onClick={() => fetchCommunities(searchParams.toString())}>Search</Button>
          <input
            type="text"
            className='community-search'
            placeholder='Search communities'
            value={keyword}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <h2 className="ml-15 mt-36">All Communities</h2>
      <div className="community-list">
        {communities.map((community) => (
          <CommunityBox
            key={community._id}
            name={community.communityName}
            picture={community.communityPicture}
            members={community.communityMembers}
            listings={community.communityListings.length} 
            onClick={() => handleCommunityClick(community.communityName)}
          />
        ))}
      </div>
    </div>
  );
};

export default CommunitiesPage;
