import React from 'react';

const Message = ({msg, user}) => {
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';

    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (isToday(date)) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };
  const renderContent = (message) => {

    const timeAndDate = (
      <div className="message-time">
        {formatTime(message.timestamp)}
        {formatDate(message.timestamp) && (
          <span className="message-date">, {formatDate(message.timestamp)}</span>
        )}
      </div>
    );

    if (message.isFile) {
      if (message.fileType.startsWith('image/')) {
        return (
          <div className="message-content">
            <img
              src={message.content}
              alt={message.fileName}
              style={{maxWidth: '300px', maxHeight: '300px'}}
            />
            {timeAndDate}
          </div>
        )
      } else {
        return (
          <div className="message-content">
            <img
              src={require('../../img/file_icon.png')}
              alt={message.fileName}
              style={{maxWidth: '20px', maxHeight: '20px'}}
            />
            <a href={message.content} target="_blank" rel="noopener noreferrer">
              {message.fileName}
            </a>
            {timeAndDate}
          </div>
        );
      }
    }
    return (
      <div className="message-content">
        {message.content}
        {timeAndDate}
      </div>
    );
  };
  return (
    <div className={`message ${msg.senderId === user?.username ? "sent" : "received"}`}>
      {renderContent(msg)}
    </div>
  );
};

export default Message;