import React from 'react';
import MessageList from '../message/MessageList';
import MessageInput from '../message/MessageInput';
import MessageDelete from "../message/MessageDelete";

const ChatArea = ({
                    messages,
                    currentUser,
                    selectedUser,
                    onSendMessage,
                    onSendFile,
                    onDeleteMessages,
                    messagesContainerRef,
                    onMouseEnter
                  }) => {
  return (
    <div className="chat-area" onMouseEnter={onMouseEnter}>
      {selectedUser ? (
        <>
          {messages.length > 0 ?
            <MessageDelete
              onDeleteMessages={onDeleteMessages}
            /> : <></>}
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