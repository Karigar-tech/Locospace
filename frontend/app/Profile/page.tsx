"use client";

import React, { useState , useEffect } from "react";
import { useRouter} from 'next/navigation';
import NavBar from "../../components/NavBar";
import UserProfile from "../../components/Profile/UserProfile";
import Footer from "../../components/LandingFooter";
import CardGridComp from "../../components/Profile/ListingCard";
import "../../styles/profile.css";
import { Listing } from "@/types";
import { useAuthContext } from "@/context/authContext";

const MyProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"listings" | "threads">(
    "listings"
  );
  const [listings, setListings] = useState<Listing[]>([]);
  const router = useRouter();
  const {authUser ,setAuthUser} = useAuthContext();

  const handleProfileUpdate = (profile: { user: any; listings: Listing[] }) => {
    setListings(profile.listings);
  };

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
          <div className="threads-content">Threads Content</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyProfile;
