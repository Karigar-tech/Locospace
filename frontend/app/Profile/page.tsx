"use client";

import React, { useState , useEffect } from "react";
import { useRouter} from 'next/navigation';
import NavBar from "../../components/NavBar";
import UserProfile from "../../components/Profile/UserProfile";
import Footer from "../../components/LandingFooter";
import CardGridComp from "../../components/Profile/ListingCard";
import "../../styles/profile.css";
import { Listing } from "@/types";
import { Thread } from "@/types";
import ThreadBox from "../../components/Threads/ThreadBox";
import { useAuthContext } from "@/context/authContext";
import Notification from "../../components/Seller/MessageComp";

const MyProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"listings" | "threads" | "saved">("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {authUser ,setAuthUser} = useAuthContext();
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<Thread | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<Listing[]>([]);

  const handleProfileUpdate = (profile: { user: any; listings: Listing[] }) => {
    setListings(profile.listings);
  };
  const openThread = (thread_id: Thread) => {
    if (thread_id !== null) {
      setIsThreadOpen(true);
      setSelectedThreadId(thread_id);
    }
  };

  const handleListingDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setListings((prevListings) => prevListings.filter((listing) => listing._id !== id));
        setNotification(result.message);
      } else {
        console.error(result.error);
        setNotification(result.error);
      }
    } catch (error) {
      console.error('An error occurred while deleting the listing:', error);
    }
    };

  useEffect(() => {
    setIsLoading(true);
    const getThreads = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/threads/userThreads', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        console.log('Error fetching threads:', error);
      }
      setIsLoading(false);
    };
    getThreads();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const getSavedItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile/saved', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        console.log("saveddd letsgo:", data)
        setSavedItems(data);
      } catch (error) {
        console.log('Error fetching saved items:', error);
      }
      setIsLoading(false);
    };
    getSavedItems();
  }, []);

  useEffect(() => {
    setAuthUser(localStorage.getItem('token'));
    if (!authUser) {
      router.push('/Login'); // Redirect to login page if not authenticated
    }
  }, [authUser, router]);

  return (
    <div>
      <NavBar />
      <div className="head"></div>
      <UserProfile onProfileUpdate={handleProfileUpdate} />
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="profile-toggle-container">
        <button
          className={`profile-toggle-button ${selectedTab === "listings" ? "active" : ""}`}
          onClick={() => setSelectedTab("listings")}
        >
          Listings
        </button>
        <button
          className={`profile-toggle-button ${selectedTab === "threads" ? "active" : ""}`}
          onClick={() => setSelectedTab("threads")}
        >
          Threads
        </button>
        <button
          className={`profile-toggle-button ${selectedTab === "saved" ? "active" : ""}`}
          onClick={() => setSelectedTab("saved")}
        >
          Saved
        </button>
      </div>
      <div className="profile-content-container">
        {selectedTab === "listings" ? (
            <CardGridComp data={listings} onDeleteListing={handleListingDelete} />
          ) : selectedTab === "threads" ? (
          <div className="profile-threads-content">
            {isLoading ? (
              <p>Loading...</p>
            ) : threads.length > 0 ? (
              threads.map((thread) => (
                <ThreadBox
                  onClick={()=> openThread(thread)}
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
              <p>No threads available</p>

            )}
          </div>
          ) : (
            <CardGridComp data={savedItems} onDeleteListing={handleListingDelete} showActions={false}/>
          )}
      </div>
     
    </div>
  );
};

export default MyProfile;
