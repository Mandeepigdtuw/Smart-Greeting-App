// src/services/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createClient = (data) => api.post("/api/clients", data);
export const getClients = () => api.get("/api/clients");
export const generateGreeting = (data) => api.post("/api/messages/generate", data);

export const sendToClient = (data) => api.post("/api/messages/send-to-client", data);
export const reminderToAll = () => api.post("/api/messages/reminder-all");

export default api;