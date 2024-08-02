import React, { useState } from 'react';
import '../../styles/main.css';
import { IoMdAddCircle} from 'react-icons/io';
import { IoAdd } from "react-icons/io5";
import ThreadBox from './ThreadBox';
import { Thread } from '@/types';
import AddThread from './AddThread';
import { useRouter } from "next/navigation";
import { faL } from '@fortawesome/free-solid-svg-icons';
import ReplyBox from './ReplyBox';

interface MainBoxProps {
  threads: Thread[];
  commID: string;
}

const MainBox: React.FC<MainBoxProps> = ({ threads: initialThreads, commID }) => {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThread, setIsOpenThread] = useState(false); //temp
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);


  const openThread= (thread_id : number)=>{
    console.log("YEEHAWW")
    if(thread_id!==null){
      setIsOpenThread(!isThread);
      setSelectedThreadId(thread_id);
    }
    
  }

  const handleAddThread = async (title: string, description: string) => {
    const threadData = {
      title,
      description,
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
        setIsModalOpen(false); // Close the modal after adding the thread
      } else {
        console.error('Failed to add thread');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="threads-container">
      <div className="header-container">
        <h3 className="box-title">General</h3>
        <button className="thread-add-button" onClick={() => setIsModalOpen(true)}>
          <IoAdd size={35} />
        </button>
      </div>
      <AddThread
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddThread={handleAddThread}
      />
      <div className="threads-list">
        {threads.length > 0 ? (
          <div>
            <p>Selected Thread: {selectedThreadId}</p>
            
            {threads.map((thread) => (
              <div key={thread._id} className="thread-item" onClick={() => openThread(thread._id)}>
                {isThread ? (<p>
                  <ReplyBox/>
                </p>
                
                  ) :(
                <ThreadBox
                  _id={thread._id}
                  user_id={thread.user_id}
                  community_id={thread.community_id}
                  thread_description={thread.thread_description}
                  thread_title={thread.thread_title}
                  createdAt={thread.createdAt}
                  updatedAt={thread.updatedAt}
                />
              ) }
              </div>
              
            ))}
          </div>
        ) : (
          <p>No threads found</p>
        )}
      </div>
    </div>
  );
};

export default MainBox;
