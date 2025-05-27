import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthProvider";
import "../styles/Chat.css"

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const {register} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const user = new Blob(
      [JSON.stringify({
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName
      })],
      {type: "application/json"}
    );
    formData.append("user", user)
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      await register(formData);
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
    <div className="user-form">
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />
        <button type="submit">Register</button>
        <button type="button" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default RegisterPage;