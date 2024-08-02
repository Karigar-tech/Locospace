import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import '../../styles/main.css';

interface Reply {
  _id: number;
  user_id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ReplyBoxProps {
  threadId: number;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({ threadId }) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState<string>('');
  const [threadID, setThreadID] = useState<number>();
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        console.log("Fetching for: ", threadId)
        const response= await fetch(`http://localhost:5000/api/replies/thread/${threadId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
        const data = await response.json();
        console.log("From backend we got:", data)
        setReplies(data);
      } catch (error) {
        console.log("Error fetching replies ", error)
      }
    };

    fetchReplies();
  }, [threadId]);

  const handleReplyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewReply(event.target.value);
  };

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log("I set it to: ",threadID, "Props wali: ",threadId)
      const response = await fetch('http://localhost:5000/api/replies/createReply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ threadId, content: newReply }),
      });
      console.log("Reponse is ", response)

      if (response.ok) {
        const reply: Reply = await response.json();
        setReplies([...replies, reply]);
        setNewReply('');
      } else {
        console.error('Failed to add reply');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="threads-list">
      <h2>Replies for Thread ID: {threadId}</h2>
      {replies.length > 0 ? (
        replies.map(reply => (
          <div key={reply._id} className="reply-item">
            <h4>{reply.content}</h4>
            {/* <p>By: {reply.user_id}</p> */}
            <p>Posted on: {new Date(reply.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No replies found</p>
      )}

      <form onSubmit={handleReplySubmit}>
        <textarea
          value={newReply}
          onChange={handleReplyChange}
          placeholder="Write your reply here..."
          required
        />
        <button type="submit">Add Reply</button>
      </form>
    </div>
  );
};

export default ReplyBox;
