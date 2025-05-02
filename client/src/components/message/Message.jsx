import React from 'react';

const Message = ({msg, user}) => {
  const renderContent = (message) => {
    if (message.isFile) {
      if (message.fileType.startsWith('image/')) {
        return <img src={message.content} alt={message.fileName} style={{maxWidth: '300px', maxHeight: '300px'}}/>;
      } else {
        return (<>
            <img src={require('../../img/file_icon.png')} alt={message.fileName}
                 style={{maxWidth: '20', maxHeight: '20px'}}/>
            <a href={message.content} target="_blank" rel="noopener noreferrer">
              {message.fileName}
            </a>
          </>
        );
      }
    }
    return message.content;
  };
  return (
    <div className={`message ${msg.senderId === user?.username ? "sent" : "received"}`}>
      {renderContent(msg)}
    </div>
  );
};

export default Message;