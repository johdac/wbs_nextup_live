import axios from "axios";
import {
  clearAuthSession,
  isRefreshTokenInvalidError,
  refreshAccessToken,
} from "./tokenRefresh";

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
    const requestUrl = String(originalRequest?.url || "");
    const isRefreshEndpoint = requestUrl.includes("/refresh");

    const shouldTryRefresh =
      !isRefreshEndpoint &&
      !!originalRequest &&
      !originalRequest._retry &&
      (error.response?.status === 401 || error.response?.status === 403);

    if (shouldTryRefresh) {
      originalRequest._retry = true;

      try {
        const data = await refreshAccessToken();

        // Update the header of the failed request
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // RETRY the original request with the new token
        return eventsApi(originalRequest);
      } catch (refreshError) {
        if (isRefreshTokenInvalidError(refreshError)) {
          clearAuthSession();
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
