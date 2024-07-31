import React, { useState, useEffect } from 'react';
import '../../styles/main.css';
import { IoMdAddCircle } from 'react-icons/io';
import ThreadBox from './ThreadBox';
import { User } from '@/types';
import { Community } from '@/types';


interface Thread {
  _id: string;
  user_id: User;
  community_id: Community;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
}



interface MainBoxProps {
  threads: Thread[];
}

const MainBox: React.FC<MainBoxProps> = ({ threads }) => {
  const [newThreadTitle, setNewThreadTitle] = useState('');

  

  // useEffect(() => {
  //   const fetchUsernames = async () => {
  //     const names: { [key: string]: string } = {};
  //     for (const thread of threads) {
  //       const userId = thread;
  //       const name= fetchUsername(userId);
  //       console.log("ITS: ", name);
        
  //     }
  //     setUsernameMap(name);
  //   };

  //   fetchUsernames();
  // }, [threads]);

  const handleAddThread = () => {
    if (newThreadTitle.trim() !== '') {
      // addThread(newThreadTitle, username);
      setNewThreadTitle('');
    }
  };

  return (
    <div className="threads-container">
      <h3>General</h3>
      <div className="threads-list">
        {threads.length > 0 ? (
          <div>
            {threads.map((thread) => (
              <div key={thread._id} className="thread-item">
                <ThreadBox
                  _id={thread._id}
                  user_id={thread.user_id}
                  community_id={thread.community_id}
                  thread_description={thread.thread_description}
                  createdAt={thread.createdAt}
                  updatedAt={thread.updatedAt}
                  
                />
                {/* <p>ITS: {thread.community_id}</p> */}
              </div>
            ))}
          </div>
        ) : (
          <p>No threads found</p>
        )}
      </div>
      <div className="thread-input-container">
        <input
          type="text"
          className="thread-input"
          placeholder="Add new thread"
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
        />
        <button className="thread-add-button" onClick={handleAddThread}>
          <IoMdAddCircle size={32} />
        </button>
      </div>
    </div>
  );
};

export default MainBox;
