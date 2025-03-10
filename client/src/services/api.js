import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

export const registerUser = async (data) => {
  return axios.post(`${API_URL}/auth/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

export const logoutUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;
  return axios.post(`${API_URL}/auth/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;
  return axios.delete(`${API_URL}/auth/user-delete`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;
  return axios.post(`${API_URL}/auth/token-refresh`, {}, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
};

export const recoverUser = async (token) => {
  return axios.put(`${API_URL}/auth/user-recover?recover=${token}`);
};

export const getUsersList = async (offset,size) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;
  return axios.get(`${API_URL}/users?offset=${offset}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMessageHistory = async (username, recipient) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;
  return axios.get(`${API_URL}/messages/${username}/${recipient}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}