'use client';
import { extractTime } from "../../utils/extractTime";
import React from "react";

const Message = ({message}) => {
  const formattedtime = extractTime(message.createdAt);
  const fromMe = message.senderId === localStorage.getItem("userID");
  const chatClassName = fromMe ? "d-flex flex-row justify-content-end" : "d-flex flex-row justify-content-start";
  const bubblecolor = fromMe ? "bg-primary" : "bg-secondary";
  return (
    <>
      <div className={`${chatClassName}`}>
        <div>
          <p className={`d-flex flex-col small p-2 text-white rounded-3 gap-2 ${bubblecolor}`}>
            {message.message}
            <span className="d-flex justify-content-end pt-3" style={{fontSize:"0.5em"}}>{formattedtime}</span>
          </p>  
        </div>
      </div>
    </>
  );
};

export default Message;
