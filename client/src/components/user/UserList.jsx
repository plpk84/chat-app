import React from 'react';
import UserItem from "./UserItem";
import './UserItem.css'

const UserList = ({users, notificationCount, selectedUsername, handleClick}) => {
  return (
    <ul>
      {users.map((u) => (
        <li
          key={u.username}
          className={`user-item ${u.username === selectedUsername ? "active" : ""}`}
          onClick={async () => await handleClick(u)}
        >
          <UserItem user={u}/>
          {notificationCount[u.username] > 0 && (
            <span className="nbr-msg">{notificationCount[u.username]}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default UserList;