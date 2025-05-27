import React from 'react';
import {FaTrash} from "react-icons/fa";

const MessageDelete = ({onDeleteMessages}) => {
  return (
    <div className="message-header">
      <button
        className="delete-messages-button"
        onClick={onDeleteMessages}
        title="Delete messages"
      >
        <FaTrash/>
      </button>
    </div>
  );
};

export default MessageDelete;