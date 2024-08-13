'use client';
import Message from "./Message";
import "../../styles/scrollbar.css";
import useGetMessages from "../Hooks/useGetMessage";
import useListenMessage from "../Hooks/useListenMessage";
import { useEffect , useRef } from "react";
const Messages = () => {
  const { messages, loading } = useGetMessages(); 
  useListenMessage();
  const lastMessageRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      
    }, 100);
  }, [messages]);

  return (
    
    <div
      className="d-flex flex-column justify-content-center w-90 ">
      {!loading &&
				messages.length > 0 &&
				messages.map((message:any) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))}
      {!loading && messages.length === 0 && (
        <p className="text-center">No messages yet</p>
      )}
    </div>
  );
};

export default Messages;
