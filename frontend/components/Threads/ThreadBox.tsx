import React from 'react';
import '../../styles/main.css';

interface BoxProps {
  title: string;
  username: string;
}

const ThreadBox: React.FC<BoxProps> = ({ title, username}) => {
  return (
    <div className='thread-box'>

      <p className='thread-members'>{username}</p>
      
      <h3 className='thread-title'><br/>{title}</h3>
    </div>
  );
};

export default ThreadBox;
