import axios from "axios";
import { clearAuthSession, refreshAccessToken } from "./tokenRefresh";

const URL = import.meta.env.VITE_API_SERVER_URL;

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

eventsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const data = await refreshAccessToken();

        // Update the header of the failed request
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // RETRY the original request with the new token
        return eventsApi(originalRequest);
      } catch (refreshError) {
        // If refresh token is expired or deleted, user MUST log in again
        clearAuthSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
