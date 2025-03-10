import React, {useState, useContext} from "react";
import {loginUser} from "../services/api";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
import "../styles/Chat.css"

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {login} = useContext(AuthContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({username, password});
      login(response.data);
      navigate("/");
    } catch (error) {
      alert("Invalid credentials.");
    }
  };
  
  const handleRegister = () => {
    navigate("/register");
  }
  
  return (
    <div className="user-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <button type="button" onClick={handleRegister}>Register</button>
      </form>
    </div>
  );
};

export default LoginPage;