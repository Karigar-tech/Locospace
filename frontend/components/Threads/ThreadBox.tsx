interface ThreadBoxProps {
  _id: string;
  user_id: string;
  community_id: string;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
  username: string;
}

const ThreadBox: React.FC<ThreadBoxProps> = ({
  _id,
  user_id,
  community_id,
  thread_description,
  createdAt,
  updatedAt,
  username
}) => {
  return (
    <div className="thread-box">
      <h4>{username}</h4>
      <p>{thread_description}</p>
      <small>{new Date(createdAt).toLocaleString()}</small>
    </div>
  );
};

export default ThreadBox;
