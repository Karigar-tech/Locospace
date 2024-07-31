import React from 'react';
import '../../styles/main.css';

interface BoxProps {
  _id: string;
  user_id: string;
  community_id: string;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  
}

const ThreadBox: React.FC<BoxProps> = ({ _id, community_id, thread_description, createdAt, updatedAt, username}) => {
  return (
    <div className='thread-box'>
      <p className='thread-description'>{thread_description}</p>
      <p>{username}</p>
      <p className='thread-created-at'>dated: {new Date(createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ThreadBox;
