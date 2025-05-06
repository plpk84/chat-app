import React from 'react';
import UserProfile from '../user/UserProfile';
import UserList from '../user/UserList';
import '../../styles/Chat.css'

const ChatSidebar = ({
                       currentUser,
                       users,
                       selectedUsername,
                       notificationCount,
                       onUserSelect,
                       onRefreshContacts,
                       onLogout,
                       onProfile
                     }) => {
  return (
    <div className="left-panel">
      <div className="users-list-container">
        <div onClick={onProfile}>
          <UserProfile user={currentUser}/>
        </div>
        <div>
          <h2>Users</h2>
          <span onClick={onRefreshContacts}>Refresh Users</span>
        </div>
        <UserList
          users={users}
          selectedUsername={selectedUsername}
          notificationCount={notificationCount}
          handleClick={onUserSelect}
        />
      </div>
      <div>
        <a className="redirect-button" onClick={onLogout}>Logout</a>
      </div>
    </div>
  );
};

export default ChatSidebar;