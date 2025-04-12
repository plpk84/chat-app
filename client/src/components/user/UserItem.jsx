import React from 'react';

const UserItem = ({user}) => {
  return (
    <div className={`user-item`}>
      <div className={'status-container'}>
        <img src={require("../../img/user_icon.png")} alt={user?.username}/>
        <div className={`status-circle ${user?.status === "ONLINE" ? "online" : "offline"}`}></div>
      </div>
      <span>{`${user?.first_name} ${user?.last_name}`}</span>
    </div>
  )
}
export default UserItem;