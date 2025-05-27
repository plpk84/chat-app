import React, {useContext, useRef} from "react";
import {AuthContext} from "../contexts/AuthProvider";
import {useNavigate} from "react-router-dom";
import "../styles/Chat.css"
import {api} from "../services/api";

const ProfilePage = () => {
  const {authState, logout, deleteUser, refreshUser} = useContext(AuthContext);
  const avatarInputRef = useRef(null);
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

  const handleImageClick = () => {
    avatarInputRef.current.click();
  }

  const handleImageChange = async (e) => {
    const avatar = e.target.files[0];
    if (!avatar) {
      return
    }
    const formData = new FormData();
    formData.append('avatar', avatar);
    try {
      await api.post(`/users/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    await refreshUser();
  };

  const handleContacts = () => {
    navigate("/contacts");
  };

  return (
    <div className="user-form">
      <h2>Profile</h2>
      <div className={"image"}>
        <input style={{display: 'none'}}
               ref={avatarInputRef}
               type="file"
               accept="image/*"
               onChange={handleImageChange}
        />
        <img src={authState.user?.avatar_url ? authState.user.avatar_url : require("../img/user_icon.png")}
             alt={"nophoto"} onClick={handleImageClick}></img>
      </div>
      <h2>Username: {authState.user ? authState.user.username : `Loading...`}</h2>
      <h2>Name: {authState.user ? `${authState.user.first_name} ${authState.user.last_name}` : `Loading....`}</h2>
      <button onClick={handleContacts}>Contacts</button>
      <button onClick={handleChat}>To chat</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default ProfilePage;