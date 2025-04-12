import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthProvider";
import "../styles/Chat.css"

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {login} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({username, password});
    console.log(result)
    if (result.success) {
      navigate("/");
    } else {
      console.error("Login Failed ", result.error);
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