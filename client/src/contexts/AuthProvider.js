import React, {createContext, useEffect, useLayoutEffect, useState} from "react";
import {api} from "../services/api";
import {useNavigate} from "react-router-dom";

export const AuthContext = createContext(undefined);
export const AuthProvider = ({children}) => {
  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    isLoading: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const response = await api.get(`/auth/refresh-token`)
        const {user, access_token} = response.data;
        setAuthState(prevState => ({
          ...prevState,
          user: user,
          accessToken: access_token,
          isLoading: false
        }));
      } catch (err) {
        navigate("/login")
      }
    };
    refreshUser();
  }, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization = !config.retry && authState.accessToken ?
        `Bearer ${authState.accessToken}` : config.headers.Authorization
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [authState.accessToken]);

  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        console.log(error)
        if (!originalRequest.retry && error.response?.status === 403) {
          try {
            originalRequest.retry = true;

            const response = await api.get(`/auth/refresh-token`);
            const {user, access_token} = response.data;
            setAuthState({
              user: user,
              accessToken: access_token,
              isLoading: false
            });

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return api.request(originalRequest);
          } catch (refreshError) {
            setAuthState({user: null, accessToken: null, isLoading: true});
            originalRequest.retry = false;
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (userData) => {
    try {
      const response = await api.post(`/auth/login`, userData);
      const {access_token, user} = response.data
      setAuthState({
        user: user,
        accessToken: access_token,
        isLoading: false
      });
      return {success: true};
    } catch (error) {
      console.error("Login failed:", error);
      return {success: false, error};
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post(`/auth/register`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const {access_token, user} = response.data
      setAuthState({
        user: user,
        accessToken: access_token,
        isLoading: false
      });
      return {success: true};
    } catch (error) {
      console.error("Login failed:", error);
      return {success: false, error};
    }
  };

  const logout = async () => {
    try {
      await api.post(`/auth/logout`, {}, {
        headers: {Authorization: `Bearer ${authState.accessToken}`},
      });
      setAuthState({
        user: null,
        accessToken: null,
        isLoading: true
      });
      return {success: true};
    } catch (error) {
      console.error("Logout error:", error);
      return {success: false, error};
    }
  };

  const deleteUser = async () => {
    try {
      await api.delete(`/auth/user-delete`, {
        headers: {Authorization: `Bearer ${authState.accessToken}`},
      });
      setAuthState({
        user: null,
        accessToken: null,
        isLoading: true
      });
      return {success: true};
    } catch (error) {
      console.error("Logout error:", error);
      return {success: false, error};
    }
  };

  const recoverUser = async () => {
    try {
      await api.put(`/auth/user-recover`);
      return {success: true};
    } catch (error) {
      console.error("Logout error:", error);
      return {success: false, error};
    }
  };

  return (
    <AuthContext.Provider value={{
      authState,
      register,
      login,
      logout,
      deleteUser,
      recoverUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};