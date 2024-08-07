import React from "react";
import { IoIosSend } from "react-icons/io";
import useSendMessage from "../Hooks/useSendMessage";
import useGetConversations from "../Hooks/useGetConversations";

const MessageInput = () => {
  const [message, setMessage] = React.useState("");
  const { loading, sendMessage } = useSendMessage();
  const { conversations } = useGetConversations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3 gap-1 ">
        <input
          type="text"
          className="form-control form-control-sm"
          id="exampleFormControlInput1"
          placeholder="Type message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          <IoIosSend />
        </button>
        {loading && <span className="spinner-border sr-only"></span>}
      </div>
    </form>
  );
};

export default MessageInput;
