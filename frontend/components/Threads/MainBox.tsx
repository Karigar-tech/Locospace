import React, { useState, useEffect } from 'react';
import '../../styles/main.css';
import { IoMdAddCircle } from 'react-icons/io';
import ThreadBox from './ThreadBox';

interface Thread {
  _id: string;
  community_id: string;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
  communityName: string
}

interface MainBoxProps {
  threads: Thread[];
}

const MainBox: React.FC<MainBoxProps> = ({ threads }) => {
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [username, setUsername] = useState('');
  const [communityNames, setCommunityNames] = useState<{ [key: string]: string }>({});

  const fetchCommunityName = async (community_id: Thread) => {
    console.log('Fetching community name for ID:', community_id); // Log the community ID
    try {
      const response = await fetch(`http://localhost:5000/api/community/commID/${community_id._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.communityName;
    } catch (error) {
      console.error('Error fetching community name:', error);
      return null;
    }
  };
  

  useEffect(() => {
    const fetchCommunityNames = async () => {
      const names: { [key: string]: string } = {};
      for (const thread of threads) {
        const community_id = thread.community_id;
        if (!names[community_id]) {
          const name = await fetchCommunityName(community_id);
          if (name) {
            names[community_id] = name;
          }
        }
      }
      setCommunityNames(names);
    };

    fetchCommunityNames();
  }, [threads]);

  const handleAddThread = () => {
    if (newThreadTitle.trim() !== '') {
      // addThread(newThreadTitle, username);
      setNewThreadTitle('');
      setUsername('');
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
                <h4>{communityNames[thread.community_id]}</h4>
                <ThreadBox
                  _id={thread._id}
                  community_id={thread.community_id}
                  thread_description={thread.thread_description}
                  createdAt={thread.createdAt}
                  updatedAt={thread.updatedAt}
                  communityName= {thread.communityName}
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
