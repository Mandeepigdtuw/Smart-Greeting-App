// Axios is a tool to which helps in making end points request in REST API like POST/.. AND GET/..
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createClient = (data) => api.post("/api/clients", data);
export const getClients = () => api.get("/api/clients");
