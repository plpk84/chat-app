import React, {createContext, useState, useEffect, useRef} from "react";
import { refreshAccessToken } from "../services/api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await refreshAccessToken();
        const { access_token:accessToken, refresh_token:refreshToken, user } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setUser(user);
      } catch (error) {
        console.error("Failed to refresh token:", error);
        logout();
      }
    };

    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedAccessToken) {
      if (hasFetched.current) return;
      fetchUser();
      hasFetched.current = true;
    }
  }, []);

  const login = (userData) => {
    const { access_token:accessToken, refresh_token:refreshToken, user } = userData;
    console.log(userData);
    console.log(accessToken,refreshToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};