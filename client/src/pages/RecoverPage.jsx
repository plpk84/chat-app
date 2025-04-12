import React, {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthProvider";

const RecoverPage = () => {
  const {recoverUser} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const recovering = async () => {
      try {
        await recoverUser();
        alert("Account recovered successfully!");
        navigate("/login");
      } catch (error) {
        alert("No recovery token.");
        navigate("/register")
      }
    }
    recovering();
  }, [])

  return (
    <div>
      <h2>Recovering....</h2>
    </div>
  );
};

export default RecoverPage;