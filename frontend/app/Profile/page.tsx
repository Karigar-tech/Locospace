"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';
import { Listing } from "@/types";
import { Thread } from "@/types";
import { useAuthContext } from "@/context/authContext";

const NavBar = dynamic(()=> import('../../components/NavBar'),{ssr:false}) ;
const UserProfile = dynamic(()=>import('../../components/Profile/UserProfile'),{ssr:false});
const CardGridComp = dynamic(()=> import('../../components/Profile/ListingCard'),{ssr:false});
const ThreadBox = dynamic(()=>import('../../components/Profile/ThreadBox'),{ssr:false});
const Notification = dynamic(()=> import ('../../components/Seller/MessageComp'),{ssr:false}) ;

import styles from "../../styles/profile.module.css";


const MyProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"listings" | "threads" | "saved">("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { authUser, setAuthUser } = useAuthContext();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listings/${id}`, {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/threads/userThreads`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        console.log(data)
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/saved`, {
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
      <UserProfile onProfileUpdate={handleProfileUpdate} />
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div className={styles.profileToggleContainer}>
        <button
          className={`${styles.profileToggleButton} ${selectedTab === "listings" ? styles.active : ""}`}
          onClick={() => setSelectedTab("listings")}
        >
          Listings
        </button>
        <button
          className={`${styles.profileToggleButton} ${selectedTab === "threads" ? styles.active : ""}`}
          onClick={() => setSelectedTab("threads")}
        >
          Threads
        </button>
        <button
          className={`${styles.profileToggleButton} ${selectedTab === "saved" ? styles.active : ""}`}
          onClick={() => setSelectedTab("saved")}
        >
          Saved
        </button>
      </div>
      <div className={styles.profileContentContainer}>
        {selectedTab === "listings" ? (
          <CardGridComp data={listings} onDeleteListing={handleListingDelete} />
        ) : selectedTab === "threads" ? (
          <div className={styles.profileThreadsContent}>
            {isLoading ? (
              <p className={styles.profileLoadingText}>Loading...</p>
            ) : threads.length > 0 ? (
              threads.map((thread) => (
                <ThreadBox
                  onClick={() => openThread(thread)}
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
              <p className={styles.noThreadsMessage}>No threads available</p>
            )}
          </div>
        ) : (
          <CardGridComp data={savedItems} onDeleteListing={handleListingDelete} showActions={false} />
        )}
      </div>
    </div>
  );
};

export default MyProfile;
