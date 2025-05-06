import React from 'react';
import '../../styles/Chat.css'

const UserProfile = ({user}) => {
  return (
    <div className="user-item">
      <div className="status-container">
        <img
          src={user?.avatar_url || require("../../img/user_icon.png")}
          alt={user?.username}
        />
        <div className={`status-circle ${user?.status === "ONLINE" ? "online" : "offline"}`}></div>
      </div>
      <span>{user?.username}</span>
    </div>
  );
};

export default UserProfile;