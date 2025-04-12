import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthProvider";
import "../styles/Chat.css"

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const {register} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        username,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      alert("Error during registration.");
    }
  };
  
  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <div className = "user-form">
      <h2>Register</h2>
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
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button type="submit">Register</button>
        <button type="button" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default RegisterPage;