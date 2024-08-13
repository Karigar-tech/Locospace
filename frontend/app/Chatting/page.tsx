"use client";
import {useEffect, useState} from 'react'
import MessageContainer from '../../components/Chat/MessageContainer';
import SideChats from '../../components/Chat/SideChats';
import { useAuthContext } from '../../context/authContext';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';

const Page = () => {
  const router = useRouter();
  const {authUser ,setAuthUser} = useAuthContext();
  const [token ,setToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthUser(localStorage.getItem('token'));
    if (!authUser) {
      router.push("/Login"); // Redirect to login page if not authenticated
    }
  }, [authUser, router]);
  return (
    <div>
      <>
      <NavBar/>
      </>
    <div className='d-flex' style={{height:"auto"}}>
        <SideChats/>
        <MessageContainer/>
    </div>
    </div>
  )
}

export default Page 
