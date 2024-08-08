'use client';
import React from 'react';
import EachConversation from './EachConversation';
import useGetConversations from '../Hooks/useGetConversations';

const Conversations = () => {
  const { loading, conversations } = useGetConversations();  
  return (
    <div className='overflow-auto' style={{ height: "400px" }}>
      {conversations.map((conversation: any) => (
        <EachConversation 
          key={conversation._id} 
          conversation={conversation} 
        />
      ))}
      {loading && <span className='spinner-border sr-only'></span>}
    </div>
  );
};

export default Conversations;