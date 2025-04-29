import React, {useContext} from "react";
import {AuthContext} from "../contexts/AuthProvider";
import {useNavigate} from "react-router-dom";
import "../styles/Chat.css"

const ProfilePage = () => {
  const {authState, logout, deleteUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      await deleteUser();
      navigate("/login");
    }
  };

  const handleChat = () => {
    navigate("/chat")
  };

  return (
    <div className="user-form">
      <h2>Profile</h2>
      <div className={"image"}>
        <img src={authState.user?.avatar_url ? authState.user.avatar_url : require("../img/user_icon.png")}
             alt={"nophoto"}></img>
      </div>
      <p>Username: {authState.user ? authState.user.username : `Loading...`}</p>
      <p>Name: {authState.user ? `${authState.user.first_name} ${authState.user.last_name}` : `Loading....`}</p>
      <button onClick={handleChat}>To chat</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default ProfilePage;