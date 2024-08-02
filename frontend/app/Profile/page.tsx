"use client";

import React, { Suspense,useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import UserProfile from "../../components/Profile/UserProfile";
import Footer from "../../components/LandingFooter";
import CardGridComp from "../../components/Profile/ListingCard";
import "../../styles/profile.css";
import { Listing } from "@/types";
import { Thread } from '@/types';
import ThreadBox  from '../../components/Threads/ThreadBox';

const MyProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"listings" | "threads">(
    "listings"
  );
  const [listings, setListings] = useState<Listing[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleProfileUpdate = (profile: { user: any; listings: Listing[] }) => {
    setListings(profile.listings);
  };

  useEffect(() => {
    setIsLoading(true);
    const getThreads = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/threads/userThreads', 
          {method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        console.log("ITS: ", data)
        setThreads(data);
      } catch (error) {
        console.log('Error fetching threads:', error);
      }
      setIsLoading(false);
    };
    getThreads();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="head"></div>
      <UserProfile onProfileUpdate={handleProfileUpdate} />
      <div className="profile-toggle-container">
        <button
          className={`profile-toggle-button ${
            selectedTab === "listings" ? "active" : ""
          }`}
          onClick={() => setSelectedTab("listings")}
        >
          Listings
        </button>
        <button
          className={`profile-toggle-button ${
            selectedTab === "threads" ? "active" : ""
          }`}
          onClick={() => setSelectedTab("threads")}
        >
          Threads
        </button>
      </div>
      <div className="content-container">
        {selectedTab === "listings" ? (
          <div className="listings-content">
            <CardGridComp data={listings} />
          </div>
        ) : (
          <div className="threads-content">

            {isLoading  ? (
              <p>Loading..</p>
            ) : threads!==null ? (
              threads.map(thread =>(
                <ThreadBox 
                key={thread._id}
                _id={thread._id}
                user_id={thread.user_id}
                community_id={thread.community_id}
                thread_description={thread.thread_description}
                thread_title={thread.thread_title}
                createdAt={thread.createdAt}
                updatedAt={thread.updatedAt}
                />
              ))
            ) : (
              <p>Alaka Threads Nishta</p>
            )}
            
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyProfile;
