import React, {useContext, useEffect} from "react";
import {logoutUser, deleteUser} from "../services/api";
import {AuthContext} from "../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import "../styles/Chat.css"

const ProfilePage = () => {
  const {user, logout: authLogout} = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (localStorage.getItem("accessToken") === null||!user) {
      navigate("/login");
    }
  }, [navigate,user])
  
  const handleLogout = async () => {
    await logoutUser();
    authLogout();
    navigate("/login");
  };
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      await deleteUser();
      authLogout();
      navigate("/login");
    }
  };
  
  const handleChat = () => {
    navigate("/chat")
  };
  
  return (
    <div className="user-form">
      <h2>Profile</h2>
      <p>Username: {user?.username}</p>
      <p>Name: {user?.first_name} {user?.last_name}</p>
      <button onClick={handleChat}>To chat</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default ProfilePage;