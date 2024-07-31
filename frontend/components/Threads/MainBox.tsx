import React, { useState, useEffect } from 'react';
import '../../styles/main.css';
import { IoMdAddCircle } from 'react-icons/io';
import ThreadBox from './ThreadBox';
import { User } from '@/types';

interface Thread {
  _id: string;
  user_id: string ;
  community_id: string;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
  username: string;
}



interface MainBoxProps {
  threads: Thread[];
}

const MainBox: React.FC<MainBoxProps> = ({ threads }) => {
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [usernameMap, setUsernameMap] = useState<{ [key: string]: string }>({});

  // const fetchUsername = async (thread: Thread) => {
  //   console.log('Fetching username for ID:',  thread.username); // Log the user ID
  //   return thread.username
  // };

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
                  username={thread.username}
                />
                <p>ITS: {thread.username}</p>
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
