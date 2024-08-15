'use client';
import React from 'react'
import Messages from './Messages';
import MessageInput from './MessageInput';
import useConversation from '@/zustand/useConversation';
import '../../styles/chat.css'

const MessageContainer = () => {
  const { selectedConversation } = useConversation();   
  return (
    <div className='d-flex flex-column w-75 custom-scrollbar' style={{height:"590px"}}>
      {
        !selectedConversation ? <NoChatSelected/> :(
        <>
          <div className='px-4 py-2 pt-4 mb-2' style={{backgroundColor:"#3d8bfd"}}>
            <span style={{ fontWeight: 'bold', fontSize: '1.5em' , fontFamily:"Gotham" }}> To: </span>  
            <span style={{ fontWeight: 'bold', fontSize: '1.5em' , fontFamily:"Gotham" }}> {selectedConversation.name} </span> 
          </div>
          <div className='overflow-auto custom-scrollbar message-container' style={{height:"600px"}}>
            <Messages/>
          </div>
          <MessageInput/>
        </>
        
        )
      }
    </div>
  )
}

const NoChatSelected = () => {
  return (
    <div className='d-flex justify-content-center align-items-center w-full h-full chat-image' style={{ height: '100vh', border: '1px solid #E7E7E7' }}>
      <div className='px-4 justify-content-center d-flex flex-row items-center gap-2'>
        <p style={{fontSize:'1.5em' , fontFamily: 'Source San Pro'}}>Welcome!</p>
        <p style={{fontSize:'1.5em' , fontFamily: 'Source San Pro'}} >Select a chat to get started!</p>
      </div>
    </div>
  )
}
export default MessageContainer;
