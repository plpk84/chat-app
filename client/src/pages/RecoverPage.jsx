import React, { useState } from "react";
import { recoverUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const RecoverPage = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recoverUser(token);
      alert("Account recovered successfully!");
      navigate("/login");
    } catch (error) {
      alert("Invalid recovery token.");
    }
  };

  return (
    <div>
      <h2>Recover Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recovery Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button type="submit">Recover</button>
      </form>
    </div>
  );
};

export default RecoverPage;