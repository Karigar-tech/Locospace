import React, { useState } from 'react';
import '../../styles/main.css';
import { IoMdAddCircle } from 'react-icons/io';
import ThreadBox from './ThreadBox';
import { Thread } from '@/types';

interface MainBoxProps {
  threads: Thread[];
  commID: string;
}

const MainBox: React.FC<MainBoxProps> = ({ threads: initialThreads, commID }) => {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadDescription, setNewThreadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAddThread = async () => {
    
    if (newThreadTitle.trim() !== '' && newThreadDescription.trim() !== '') {
      const threadData = {
        title: newThreadTitle,
        description: newThreadDescription,
        community_id: commID,
      };
  
      try {
        const response = await fetch("http://localhost:5000/api/threads/createThread", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(threadData),
        });
  
        if (response.ok) {
          const newThread = await response.json();
          setThreads([...threads, newThread]);
          setNewThreadTitle('');
          setNewThreadDescription('');
        } else {
          console.error('Failed to add thread');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  

  return (
    <div className="threads-container">
      <h3 style={{ color: '#ffffff' }}>General</h3>
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
                  thread_title={thread.thread_title}
                  createdAt={thread.createdAt}
                  updatedAt={thread.updatedAt}
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
          placeholder="Thread title"
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
        />
        <textarea
          className="thread-input"
          placeholder="Thread description"
          value={newThreadDescription}
          onChange={(e) => setNewThreadDescription(e.target.value)}
        />
        {/* <input
          type="file"
          className="thread-input"
          onChange={handleFileChange}
        /> */}
        <button className="thread-add-button" onClick={handleAddThread}>
          <IoMdAddCircle size={32} />
        </button>
      </div>
    </div>
  );
};

export default MainBox;
