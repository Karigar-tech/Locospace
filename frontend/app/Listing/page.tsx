"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageGallery from '../../components/ImageGallery';
import { Button } from 'react-bootstrap';
import '../../styles/selectedlist.css';
import { Listing, User } from '../../types'; 
import { BsHeart , BsShare } from 'react-icons/bs';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaRunning, FaTree, FaBuilding, FaHandsHelping, FaShieldAlt, FaMoneyBillWave, FaPaw, FaCopy } from 'react-icons/fa';
import VerticalCardCarousel from '../../components/VerticalCarousel';
import MapComponent from '../../components/MapComponentListing';
import { geocodeAddress } from '../../utils/geocode';
import NavBar from '../../components/NavBar';
import { useSearchParams } from 'next/navigation';


const SelectedListing: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  console.log(id)
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const text = 'Check out this listing!';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Page',
        text: text,
        url: url,
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch((err) => {
        console.error('Error sharing:', err);
      });
    } else {
      window.open(`mailto:?subject=Check out this page&body=${text} ${url}`);
      window.open(`https://api.whatsapp.com/send?text=${text} ${url}`);
      window.open(`https://twitter.com/intent/tweet?text=${text} ${url}`);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return; 
      try {
        const response = await fetch(`http://localhost:5000/api/listings/specific/${id}`);  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Listing = await response.json(); 
        console.log('Fetched listing data:', data);
        setListing(data);
        setUser(data.user)
        const coords = await geocodeAddress(data.location);
        if (coords) {
          setCoordinates(coords);
        } else {
          throw new Error('Geocoding failed');
        }
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
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
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  const preferenceIconMap: Record<string, React.ReactElement> = {
    "Busy": <FaRunning />,
    "Peaceful": <FaBed />,
    "Green": <FaTree />,
    "Commercial": <FaBuilding />,
    "Supportive": <FaHandsHelping />,
    "Safe": <FaShieldAlt />,
    "Affordable": <FaMoneyBillWave />,
    "PetFriendly": <FaPaw />
  };

  return (
    <div className="row">
      <NavBar />
      <div className="col-md-7 d-flex flex-column gap-3">
        <div className="rectangle">
          <ImageGallery images={images} />
        </div>
        <div className="firstbox rec1 rectangle mb-3">
        <div className="container">
            <div className="row justify-content-end align-items-start">
              <div className="col-6">
                {listing.listing_type === 'Sell' ? <h1 style={{"color": "#290661"}}>For Sale</h1> : listing.listing_type === 'Rent' ? <h1 style={{"color": "#290661"}}>For Rent</h1> : ''}
                <h4 style={{"color": "#290661"}}>PKR {listing.price}</h4>
              </div>
              <div className="col-6 d-flex justify-content-end align-items-start">
              <Button variant="outline-secondary" className="btn-listing"><BsHeart/>Save</Button>
              <Button variant="outline-secondary" className="btn-listing" onClick={handleShare}><BsShare/>Share</Button>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <span>
                    Bedroom <br />
                    <span className="bedroom-info">
                    <FaBed className="bed-icon" />
                    {listing.bedroom}
                    
                    </span>
                </span>
                <span>
                    Bathroom                    
                    <span className="bathroom-info">
                    <FaBath className="bathroom-icon" />
                    {listing.bath}
                    
                    </span>
                </span>
                <span>
                    Area Space <br />
                    <span className="area-info">
                    <FaRulerCombined className="area-icon" />   
                    {listing.area}
                    </span>
                </span>
            </div>
    
            </div>
          </div>
        </div>
        <div className="rectangle rec2">
            <h2>Environment</h2>
            <div className="col-12 prefernece">
                {listing.preferences.environment.map((preference, index) => (
                <Button variant="outline-primary" key={index} className="tags m-1">
                    {preferenceIconMap[preference]} {preference}
                </Button>
                ))}
          </div>
           
        </div>
        <div className="rectangle rec2">
            <h2>Description</h2>
            {listing.Description}
        </div>
        <div className="rectangle rec2">
            <h2>Location</h2>
            <div className="location-content">
              {listing.location}
            </div>
            {/* {coordinates && <MapComponent latitude={coordinates.latitude} longitude={coordinates.longitude} />}   */}
        </div>
      </div>
        <div className="col-md-4 d-flex flex-column gap-3">
        <div className="side rectangle p-5 mb-3">
            
            <div className="upper d-flex align-items-center mb-3">
            <div className="circle-image-container me-3">
                
            {user?.profilePicture ? (
              <Image
                src={user.profilePicture.url}
                alt="Profile Image"
                width={100}
                height={100}
                className="circle-image"
              />
            ) : (
              <Image
                src="/no-profile-picture-15257.svg" 
                alt="Default Profile Image"
                width={100}
                height={100}
                className="circle-image"
              />
            )}
            </div>
            <div>
              <h5>{user?.name}</h5>
            </div>
            </div>

            <div className="contact-info mb-3">
            <div className="contact-field mb-4">
                <label htmlFor="contact-number" className="form-label">Contact Number</label>
                <div className="d-flex align-items-center position-relative rounded-input-container">
                  <input
                    type="text"
                    id="contact-number"
                    className="form-control rounded-input"
                    placeholder={user?.contact}
                    readOnly
                    onFocus={(e) => e.target.blur()} 
                    
                  />
                  <FaCopy 
                  onClick={() => handleCopy(user?.contact || '')}
                  className="copy-icon ms-2" />
                </div>
            </div>
            <div className="contact-field mb-4">
                <label htmlFor="email-address" className="form-label">Email Address</label>
                <div className="d-flex align-items-center position-relative rounded-input-container">
                  <input
                    type="email"
                    id="email-address"
                    className="form-control rounded-input"
                    placeholder={user?.email}
                    readOnly
                    onFocus={(e) => e.target.blur()} 

                  />
                  <FaCopy 
                  onClick={() => handleCopy(user?.email || '')}
                  className="copy-icon ms-2" />
                </div>
            </div>
            </div>

      
            <div className="text-center">
            <button className="chat-btn btn btn-primary">Chat</button>
            </div>
        </div>
        <div className="rectangle side-2 p-3 mb-3">
            <VerticalCardCarousel/>
        </div>
        </div>
    </div>
  );
};

export default SelectedListing;
