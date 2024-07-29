'use client'
import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/LandingNavbar';
import SearchBar from '@/components/Listings/SearchBar';
import { Listing } from '../../types';
import { Button } from 'react-bootstrap';
import ListingBox from '@/components/Listings/ListingBox';
import NavBar from '../../components/NavBar';
import "../../styles/main.css";


interface ToggleProps {
    view: 'listings' | 'threads';
    setView: React.Dispatch<React.SetStateAction<'listings'|'threads'>>;
}

const ToggleButton:React.FC<ToggleProps> = ({view,setView}) => {

    return(<div className='toggle-container'>
        <button
          className={`toggle-button ${view=== 'listings' ? 'active' : ''}`}
          onClick={() => setView('listings')}
        >
          Listings
        </button>
        <button
          className={`toggle-button ${view=== 'threads' ? 'active' : ''}`}
          onClick={() => setView('threads')}
        >
          Threads
        </button>
        </div>)
}
export default ToggleButton;