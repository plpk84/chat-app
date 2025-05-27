import React from 'react';
import '../../styles/Chat.css'

const UserProfile = ({user}) => {
  return (
    <div className="user-item">
      <div className="status-container">
        <img
          src={user?.avatar_url || require("../../img/user_icon.png")}
          alt={user?.first_name + " " + user?.last_name}
        />
        <div className={`status-circle ${user?.status === "ONLINE" ? "online" : "offline"}`}></div>
      </div>
      <span>{user?.first_name + "\n" + user?.last_name}</span>
    </div>
  );
};

export default UserProfile;