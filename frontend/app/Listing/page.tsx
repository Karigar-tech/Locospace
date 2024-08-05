"use client";

import React, { Suspense, useEffect, useState } from "react";
import ImageGallery from "../../components/ImageGallery";
import { Button } from "react-bootstrap";
import styles from "./selectedlist.module.css";
import { Listing, User } from "../../types";
import { BsHeartFill, BsHeart, BsShare } from "react-icons/bs";
import Image from "next/image";

//Icons
import { FaParking, FaChild } from "react-icons/fa";
import { MdOutlineSecurity, MdElderly, MdOutlineHiking } from "react-icons/md";
import { FaPersonSwimming, FaPerson } from "react-icons/fa6";
import { CgGym } from "react-icons/cg";
import { GiBurningRoundShot } from "react-icons/gi";
import { GiPeaceDove } from "react-icons/gi";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaRunning,
  FaTree,
  FaBuilding,
  FaHandsHelping,
  FaShieldAlt,
  FaMoneyBillWave,
  FaPaw,
  FaCopy,
} from "react-icons/fa";
import VerticalCardCarousel from "../../components/VerticalCarousel";
import MapComponent from "../../components/MapComponentListing";
import { geocodeAddress } from "../../utils/geocode";
import NavBar from "../../components/NavBar";
import { useSearchParams } from "next/navigation";
import Notification from '../../components/Seller/MessageComp'

const ListingPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [listing, setListing] = useState<Listing | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [url, setUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const token = localStorage.getItem("token")
  


  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const text = "Check out this listing!";


  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Page",
          text: text,
          url: url,
        })
        .then(() => {
          console.log("Thanks for sharing!");
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      window.open(`mailto:?subject=Check out this page&body=${text} ${url}`);
      window.open(`https://api.whatsapp.com/send?text=${text} ${url}`);
      window.open(`https://twitter.com/intent/tweet?text=${text} ${url}`);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    }
  };
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        console.log("API Response Data:", data);
  
        const savedListings: string[] = data.user.savedListings || [];
        console.log("Saved Listings:", savedListings);
  
        const idString = id ? id.toString() : null;
        console.log("Current ID:", id);
        console.log("Current ID as String:", idString);
  
        const isSaved = savedListings.some((listingId: string) => {
          console.log("Comparing:", listingId.toString(), "with", idString);
          return listingId.toString() === idString;
        });
  
        console.log("Is Saved:", isSaved);
        setIsSaved(isSaved);
  
      } catch (error) {
        console.error("Error checking saved status:", error);
        setIsSaved(false);
      }
    };
  
    if (id) {
      checkIfSaved();
    }
  }, [id, token]);
  

 const handleSave = async () => {
  try {
    const endpoint = isSaved
      ? "http://localhost:5000/api/listings/unsavedListings"
      : "http://localhost:5000/api/listings/savedListings";

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify({ listingId: id }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsSaved(!isSaved);
      showNotification(data.message, 'success');
      console.log(isSaved ? "Listing unsaved" : "Listing saved");
    } else {
      console.error(isSaved ? "Failed to unsave listing" : "Failed to save listing");
      showNotification(data.message, 'error');
    }
  } catch (error) {
    console.error(isSaved ? "Error unsaving listing:" : "Error saving listing:", error);
    showNotification('Error.', 'error');
  }
};

  
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const response = await fetch(
          `http://localhost:5000/api/listings/specific/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Listing = await response.json();
        console.log("Fetched listing data:", data);
        setListing(data);
        setUser(data.user);
        const coords = await geocodeAddress(data.location);
        if (coords) {
          setCoordinates(coords);
        } else {
          throw new Error("Geocoding failed");
        }
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }

        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!listing) return <div>No listing data available.</div>;

  const images = listing.ListingPictures;
  const address = listing.location;

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2000); 
  };


  const environmentIconMap: Record<string, React.ReactElement> = {
    Busy: <FaRunning />,
    Peaceful: <GiPeaceDove />,
    Green: <FaTree />,
    Commercial: <FaBuilding />,
    Supportive: <FaHandsHelping />,
    Safe: <FaShieldAlt />,
    Affordable: <FaMoneyBillWave />,
    "Pet Friendly": <FaPaw />,
  };

  const facilitiesIconMap: Record<string, React.ReactElement> = {
    Gym: <CgGym />,
    "Swimming Pool": <FaPersonSwimming />,
    Parking: <FaParking />,
    Security: <MdOutlineSecurity />,
    Playground: <GiBurningRoundShot />,
  };

  const ageGroupIconMap: Record<string, React.ReactElement> = {
    Kids: <FaChild />,
    Teens: <FaPerson />,
    Adults: <MdOutlineHiking />,
    Seniors: <MdElderly />,
  };

  return (
    <div className={styles.SListingRow}>
      <NavBar />
      
    <div className = {styles.SLContainer}>
      {notification && (
          <Notification
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      <div className="col-md-7 d-flex flex-column gap-3">
        <div>
          <ImageGallery images={images} />
        </div>
        <div className={`${styles.firstbox} rectangle mb-3`}>
          <div>
            <div className = {`row ${styles.justifyContentEnd} align-items-start`}>
              <div className="col-6">
                {listing.listing_type === "Sell" ? (
                  <h1 style={{ color: "#290661" }}>For Sale</h1>
                ) : listing.listing_type === "Rent" ? (
                  <h1 style={{ color: "#290661" }}>For Rent</h1>
                ) : (
                  ""
                )}
                <h4 style={{ color: "#290661" }}>PKR {listing.price}</h4>
              </div>
              <div className={`col-6 d-flex ${styles.justifyContentEnd} align-items-start`}>
                <Button variant="outline-secondary" className={styles.SLbtnListing} onClick={handleSave}>
                  {isSaved ? <BsHeartFill /> : <BsHeart />}
                  {isSaved ? "Unsave" : "Save"}
                </Button>
                <Button
                  variant="outline-secondary"
                  className={styles.SLbtnListing}
                  // onClick={handleShare}
                >
                  <BsShare />
                  Share
                </Button>
              </div>
            </div>
            <div className="row mb-3">
              <div className={styles.col12}>
                <span>
                  Bedroom <br />
                  <span className={styles.bedroomInfo}>
                    <FaBed className={styles.bedIcon} />
                    {listing.bedroom}
                  </span>
                </span>
                <span>
                  Bathroom
                  <span className={styles.bathroomInfo}>
                    <FaBath className={styles.bathroomIcon}/>
                    {listing.bath}
                  </span>
                </span>
                <span>
                  Area Space <br />
                  <span className={styles.areaInfo}>
                    <FaRulerCombined className={styles.areaIcon}/>
                    {listing.area}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={`rectangle ${styles.rec2}`}>
          <h3>Environment</h3>
          <div className={`${styles.col12} ${styles.prefernece}`}>
            {listing.preferences.environment.map((preference, index) => (
              <Button
                variant="outline-primary"
                key={index}
                className={`${styles.tags} m-1`}
              >
                {environmentIconMap[preference]} {preference}
              </Button>
            ))}
          </div>
        </div>
        <div className={`rectangle ${styles.rec2}`}>
          <h3>Facilities</h3>
          <div className={`${styles.col12} ${styles.prefernece}`}>
            {listing.preferences.facilities.map((preference, index) => (
              <Button
                variant="outline-primary"
                key={index}
                className={`${styles.tags} m-1`}
              >
                {facilitiesIconMap[preference]} {preference}
              </Button>
            ))}
          </div>
        </div>
        <div className={`rectangle ${styles.rec2}`}>
          <h3>Age Group</h3>
          <div className={`${styles.col12} ${styles.prefernece}`}>
            {listing.preferences.ageGroup.map((preference, index) => (
              <Button
                variant="outline-primary"
                key={index}
                className={`${styles.tags} m-1`}
              >
                {ageGroupIconMap[preference]} {preference}
              </Button>
            ))}
          </div>
        </div>
        <div className={`rectangle ${styles.rec2}`}>
          <h3>Description</h3>
          {listing.Description}
        </div>
        <div className={`rectangle ${styles.rec2}`}>
          <h3>Location</h3>
          <div className={styles.SLlocationContent}>{listing.location}</div>
          {coordinates && (
            <MapComponent
              latitude={coordinates.latitude}
              longitude={coordinates.longitude}
            />
          )}
        </div>
      </div>
      <div className="col-md-4 d-flex flex-column gap-3">
      <div className={`${styles.SLSide} rectangle p-3 mb-3`}>
          <Button className={styles.SellerProfileTag}>Seller Profile</Button>
          <div className={`${styles.SLUpper} d-flex align-items-center mb-3`}>
            <div className={`${styles.SLcircleImageContainer} me-3`}>
              {user?.profilePicture ? (
                <Image
                  src={user.profilePicture.url || "/no-profile-picture-15257.svg"}
                  alt="Profile Image"
                  width={100}
                  height={100}
                  className={styles.SLcircleImage}
                />
              ) : (
                <Image
                  src="/no-profile-picture-15257.svg"
                  alt="Default Profile Image"
                  width={100}
                  height={100}
                  className={styles.SLcircleImage}
                />
              )}
            </div>
            <div>
              <h5>{user?.name}</h5>
            </div>
          </div>

          <div className="mb-3">
            <div className="mb-4">
              <label htmlFor="contact-number" className={styles.SLformLabel}>
                Contact Number
              </label>
              <div className={`"d-flex align-items-center position-relative ${styles.SLroundedInputContainer}`}>
                <input
                  type="text"
                  id="contact-number"
                  className={`${styles.SLformControl} ${styles.SLroundedInput}`}
                  placeholder={user?.contact}
                  readOnly
                  onFocus={(e) => e.target.blur()}
                />
                <FaCopy
                  onClick={() => handleCopy(user?.contact || "")}
                  className={`${styles.SLcopyIcon} ms-2`}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="email-address" className={styles.SLformLabel}>
                Email Address
              </label>
              <div className={`"d-flex align-items-center position-relative ${styles.SLroundedInputContainer}`}>
                <input
                  type="email"
                  id="email-address"
                  className={`${styles.SLformControl} ${styles.SLroundedInput}`}
                  placeholder={user?.email}
                  readOnly
                  onFocus={(e) => e.target.blur()}
                />
                <FaCopy
                  onClick={() => handleCopy(user?.email || "")}
                  className={`${styles.SLcopyIcon} ms-2`}
                />
              </div>
            </div>
          </div>

          <div className={styles.SLtextCenter}>
            <button className={`${styles.SLchatBtn} btn btn-primary`}>Live Chat</button>
          </div>
        </div>
        <div className={`rectangle ${styles.SLside2} p-3 mb-3`}>
        <VerticalCardCarousel listingId={listing._id.toString()} />
        </div>
      </div>
      
    </div>

   
    </div>
  );
};

export default ListingPage;
