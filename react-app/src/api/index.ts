import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "X-ADMIN-KEY": "keystone-admin-secret-123",
  },
  withCredentials: false,
});

export default api;
