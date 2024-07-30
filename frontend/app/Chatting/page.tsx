import React from 'react'
import MessageContainer from '../../components/Chat/messagecontainer';
import SideChats from '../../components/Chat/sidechats';

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
