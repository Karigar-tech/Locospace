import React from 'react'
import MessageContainer from '../../components/Chat/MessageContainer';
import SideChats from '../../components/Chat/SideChats';

const page = () => {
  return (
    <div>
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
