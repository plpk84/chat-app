import React from 'react';
import Message from "./Message";
import './Message.css'

const MessageList = ({ref, messages, user}) => {
  return (
    <div className="messages" ref={ref}>
      {messages.map((msg, index) => (
        <Message key={index} msg={msg} user={user}/>
      ))}
    </div>
  );
};

export default MessageList;