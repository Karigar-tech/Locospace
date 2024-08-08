"use client";
import {useEffect} from 'react'
import MessageContainer from '../../components/Chat/MessageContainer';
import SideChats from '../../components/Chat/SideChats';
import { useAuthContext } from '../../context/authContext';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  const {authUser ,setAuthUser} = useAuthContext();
  useEffect(() => {
    setAuthUser(localStorage.getItem('token'));
    if (!authUser) {
      router.push("/Login"); // Redirect to login page if not authenticated
    }
  }, [authUser, router]);
  return (
    <div className='d-flex justify-content-center overflow-hidden' style={{height:"auto"}}>
        <SideChats/>
        <MessageContainer/>
    </div>
  )
}

export default page 
