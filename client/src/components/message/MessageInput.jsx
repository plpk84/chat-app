import React, {useRef, useState} from 'react';

const MessageInput = ({onSendMessage, onSendFile}) => {
  const [messageText, setMessageText] = useState('');
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSendFile(file);
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="input-area">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{display: 'none'}}
        accept="image/*, .pdf, .doc, .docx, .txt"
      />
      <button onClick={handleFileButtonClick} className="file-button">
        Send File
      </button>
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;