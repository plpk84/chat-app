import React from "react";
import './UserItem.css'
import UserItem from "./UserItem";

const UserComponent = ({user, newMessages, onSelect}) => {
  return (
    <li
      className={`user-item ${user.isSelected ? "active" : ""}`}
      onClick={onSelect}
    >
      <UserItem user={user}/>
      {newMessages[user.username] > 0 && (
        <span className="nbr-msg">{newMessages[user.username]}</span>
      )}
    </li>
  );
};

export default UserComponent;
