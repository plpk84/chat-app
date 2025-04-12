import React from 'react';

const Message = ({msg, user}) => {
  return (
    <div className={`message ${msg.senderId === user?.username ? "sent" : "received"}`}>
      {msg.content}
    </div>
  );
};

export default Message;