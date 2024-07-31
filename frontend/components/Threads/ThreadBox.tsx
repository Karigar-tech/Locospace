import React from 'react';
import '../../styles/main.css';

interface BoxProps {
  _id: string;
  community_id: string;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
  communityName: string;
}

const ThreadBox: React.FC<BoxProps> = ({ _id, community_id, thread_description, createdAt, updatedAt, communityName}) => {
  return (
    <div className='thread-box'>
      <p className='thread-description'>{thread_description} AHHHHHHHHH</p>
      <p className='thread-created-at'>dated: {new Date(createdAt).toLocaleDateString()}</p>
      <h1>{communityName}</h1>
    </div>
  );
};

export default ThreadBox;
