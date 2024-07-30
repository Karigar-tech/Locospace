import React from 'react'
import MessageContainer from '../../components/Chat/MessageContainer';
import SideChats from '../../components/Chat/SideChats';

const page = () => {
  return (
    <div className='d-flex justify-content-center min-w-full bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
      <div>
        <SideChats/>
      </div>
      <div>
        <MessageContainer/>
      </div>
    </div>
  )
}

export default page
