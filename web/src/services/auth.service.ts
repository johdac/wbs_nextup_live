import axios from "axios";
import {
  clearAuthSession,
  isRefreshTokenInvalidError,
  refreshAccessToken,
} from "./tokenRefresh";

const authServiceURL = import.meta.env.VITE_APP_AUTH_SERVER_URL;
export const authApi = axios.create({
  baseURL: authServiceURL,
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = String(originalRequest?.url || "");
    const isAuthEndpoint =
      requestUrl.includes("/login") ||
      requestUrl.includes("/register") ||
      requestUrl.includes("/refresh") ||
      requestUrl.includes("/logout");

    const shouldTryRefresh =
      !isAuthEndpoint &&
      !!originalRequest &&
      !originalRequest._retry &&
      (error.response?.status === 401 || error.response?.status === 403);

    if (shouldTryRefresh) {
      originalRequest._retry = true;

      try {
        const data = await refreshAccessToken();

        // 2. Update the header of the failed request
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // 3. RETRY the original request with the new token
        return authApi(originalRequest);
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
