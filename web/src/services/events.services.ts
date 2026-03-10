import axios from "axios";

const URL = import.meta.env.VITE_API_SERVER_URL;
const authServiceURL = import.meta.env.VITE_APP_AUTH_SERVER_URL;

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
        const currRefreshToken = localStorage.getItem("refreshToken");

        // Use standard axios to avoid infinite loop if refresh fails
        const { data } = await axios.post(`${authServiceURL}/refresh`, {
          refreshToken: currRefreshToken,
        });

        // Update storage with the NEW pair from backend
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Update the header of the failed request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // RETRY the original request with the new token
        return eventsApi(originalRequest);
      } catch (refreshError) {
        // If refresh token is expired or deleted, user MUST log in again
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
