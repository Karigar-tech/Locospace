import React from 'react';
import '../../styles/main.css'
interface ReplyBoxProps {
  threadId: number;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({ threadId }) => {
  return (
    <div className='threads-list'>
      <h2>Replies for Thread ID: {threadId}</h2>
      {/* Your logic to display replies goes here */}
      <h1>Reply 1</h1>
      <h1>Reply 2</h1>
    </div>
  );
};

export default ReplyBox;
