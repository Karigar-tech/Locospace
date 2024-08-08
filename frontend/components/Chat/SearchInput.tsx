'use client';
import useConversation from '@/zustand/useConversation';
import React from 'react'
import { FaSearch } from "react-icons/fa";
import useGetConversations from '../Hooks/useGetConversations';

const SearchInput = () => {
  const [search , setSearch] = React.useState('');
  const {setSelectedConversation} = useConversation();
  const {conversations} = useGetConversations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!search) return;
    if(search.length < 3){
      return alert('Search term must be at least 3 characters long');
    }

    const conversation = conversations.find((c: any) => c.name.toLowerCase().includes(search.toLowerCase()));
    if(conversation){
      setSelectedConversation(conversation);
      setSearch('');

    }else{
      alert('No chat found');
    }
  }
  return (
    <form onSubmit={handleSubmit} className='d-flex justify-content-center p-3 mb-1 gap-2' style={{backgroundColor:"#3d8bfd"}}>
        <input type="text"
        placeholder='search'
        className='form-control'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
         />
        <button type='submit' className='btn btn-primary'><FaSearch/></button>
    </form>
  )
}

export default SearchInput
