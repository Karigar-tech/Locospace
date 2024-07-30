import React from 'react';
import '../../styles/main.css';

interface BoxProps {
  title: string;
  username: string;
}

const ThreadBox: React.FC<BoxProps> = ({ title, username}) => {
  return (
    <div className='thread-box'>

      <p className='thread-username'>{username}</p>
      <h4 className='thread-title'>{title}</h4>
    </div>
  );
};

export default ThreadBox;
