import axios from "axios";

const URL = "http://localhost:3000";

export const eventsApi = axios.create({
  baseURL: URL,
});

eventsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
