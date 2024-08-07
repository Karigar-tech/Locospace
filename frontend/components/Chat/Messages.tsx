'use client';
import Message from "./Message";
import "../../styles/scrollbar.css";
import useGetMessages from "../Hooks/useGetMessage";
import useListenMessage from "../Hooks/useListenMessage";
const Messages = () => {
  const { messages, loading } = useGetMessages(); 
  useListenMessage();
  return (
    <div
      className="d-flex flex-column justify-content-center w-90 ">
      {!loading &&
        messages.length > 0 &&
        messages.map((message: any) => (
          <Message 
          key={message._id} 
          message={message}
          />
        ))}
      {!loading && messages.length === 0 && (
        <p className="text-center">No messages yet</p>
      )}
    </div>
  );
};

export default Messages;
