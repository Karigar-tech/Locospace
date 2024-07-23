"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileBar from '../../components/Profile/ProfileNavbar';
import ImageGallery from '../../components/ImageGallery';
import { Button } from 'react-bootstrap';
import '../../styles/selectedlist.css';
import { Listing } from '../../types'; 

const SelectedListing: React.FC = () => {
  const router = useRouter();
 // const { id } = router.query; // Get the id from the URL
  const id = '669de60e8861af696ee191e9'

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return; 
      try {
        const response = await fetch(`http://localhost:5000/api/listings/${id}`);  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Listing = await response.json(); 
        console.log('Fetched listing data:', data);
        setListing(data);
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

  const images = listing.ListingPictures.map(pic => `data:${pic.contentType};base64,${Buffer.from(pic.data).toString('base64')}`);

  return (
    <div className="row">
      <ProfileBar />
      <div className="col-md-7 d-flex flex-column gap-3">
        <div className="rectangle p-3 mb-3">
          <ImageGallery images={images} />
        </div>
        <div className="rec1 rectangle p-3 mb-3">
        <div className="container">
            <div className="row">
              <div className="col-6">
                {listing.listing_type === 'Sell' ? <h1>For Sale</h1> : listing.listing_type === 'Rent' ? <h1>For Rent</h1> : ''}
                <h4>PKR {listing.price}</h4>
              </div>
              <div className="col-6 d-flex justify-content-end align-items-end">
              <Button variant="outline-secondary" className="btn-listing">Profile</Button>
              <Button variant="outline-secondary" className="btn-listing">Profile</Button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
              <h3>PKR {listing.price}</h3>
              </div>
    
            </div>
          </div>
        </div>
        <div className="rectangle bg-primary p-3 mb-3">
            {listing.Description}
          {listing.location}
        </div>
        <div className="rectangle bg-primary p-3 mb-3">
          {listing.bedroom} Bedroom(s)
        </div>
        <div className="rectangle bg-primary p-3 mb-3">
          {listing.bath} Bath(s)
        </div>
        <div className="rectangle bg-primary p-3 mb-3">
          {listing.kitchen} Kitchen(s)
        </div>
      </div>
      <div className="col-md-4 d-flex flex-column gap-3">
        <div className="rectangle bg-secondary p-3 mb-3">
          Price: ${listing.price}
        </div>
        <div className="rectangle bg-secondary p-3 mb-3">
          More Listings
        </div>
      </div>
    </div>
  );
};

export default SelectedListing;
