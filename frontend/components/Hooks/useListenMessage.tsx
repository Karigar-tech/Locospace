"use client";
import useConversation from "@/zustand/useConversation";
import { useSocketContext } from "../../context/socketContext";
import { useEffect } from "react";

const useListenMessage = () => {
  const context = useSocketContext();
  const socket = context?.socket;
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage:any) => {
      setMessages([...messages, newMessage])
    })
    return()=> socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};

export default useListenMessage;
