import React from 'react';
import MessageList from '../message/MessageList';
import MessageInput from '../message/MessageInput';

const ChatArea = ({
                    messages,
                    currentUser,
                    selectedUser,
                    onSendMessage,
                    onSendFile,
                    messagesContainerRef
                  }) => {
  return (
    <div className="chat-area">
      {selectedUser ? (
        <>
          <MessageList
            ref={messagesContainerRef}
            messages={messages}
            user={currentUser}
          />
          <MessageInput
            onSendMessage={onSendMessage}
            onSendFile={onSendFile}
          />
        </>
      ) : (
        <>
        </>
      )}
    </div>
  );
};

export default ChatArea;