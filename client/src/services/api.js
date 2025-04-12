import axios from "axios";


const HOST = "http://localhost:8080"
export const api = axios.create({
  withCredentials: true,
  baseURL: `${HOST}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  }
});