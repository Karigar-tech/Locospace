import React, { useState } from 'react';
import '../../styles/main.css';
import { IoMdAddCircle } from 'react-icons/io';
import ThreadBox from './ThreadBox';

interface Thread {
  title: string;
  username: string;
}

interface MainBoxProps {
  threads: Thread[];
  addThread: (title: string, username: string) => void;
}

const MainBox: React.FC<MainBoxProps> = ({ threads, addThread }) => {
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [username, setUsername] = useState('');

  const handleAddThread = () => {
    if (newThreadTitle.trim() !== '') {
      addThread(newThreadTitle, username);
      setNewThreadTitle('');
      setUsername('');
    }
  };

  return (
    <div className="threads-container">
      <h3>General</h3>
      <div className="threads-list">
        {threads.length > 0 ? (
          <ul>
            {threads.map((thread, index) => (
              <div key={index} className="thread-item">
                <ThreadBox title={thread.title} username={thread.username} />
              </div>
            ))}
          </ul>
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
