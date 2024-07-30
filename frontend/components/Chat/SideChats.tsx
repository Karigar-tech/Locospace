'use client';
import React from 'react'
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';

const SideChats = () => {

  const [searchInput, setSearchInput] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const handleSearch = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/search?search=${searchInput}`);
      const data = search.data;
      if(data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if(data.loading === 0) {
        toast.info('No user found');
      }
      else{
        setSearchResults(data);
      }

    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  return (
    <div className='h-full w-auto px-1'>
      <div className='d-flex justify-between gap-2'>
        <form onSubmit={handleSearch} className='w-auto d-flex justify-between items-center bg-white rounded-full'>
          <input 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          className='px-4 w-auto bg-transparent border-none rounded-full'
          placeholder='Search'
          />
          <button className='btn btn-circle bg-primary hover:bg-light-primary'>
          <FaSearch/>
          </button>
        </form>
      </div>
    </div>
  )
}

export default SideChats;
