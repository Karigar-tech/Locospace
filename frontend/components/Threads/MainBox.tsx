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

  const fetchUsername = async (thread: Thread) => {
    console.log('Fetching username for ID:', thread.user_id.name, thread.username); // Log the user ID
    try {
      const response = await fetch(`http://localhost:5000/api/profile/${thread.user_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data.user.username;
    } catch (error) {
      console.error('Error fetching username:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      const names: { [key: string]: string } = {};
      for (const thread of threads) {
        const userId = thread.user_id;
        if (!names[userId]) {
          const name = await fetchUsername(userId);
          if (name) {
            names[userId] = name;
          }
        }
      }
      setUsernameMap(names);
    };

    fetchUsernames();
  }, [threads]);

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
                  username={usernameMap[thread.username]}
                />
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
