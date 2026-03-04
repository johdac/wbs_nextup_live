import axios from "axios";

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

    // Check for 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currRefreshToken = localStorage.getItem("refreshToken");

        // We use standard axios here to avoid an infinite loop
        // if the refresh call itself fails
        const { data } = await axios.post(`${authServiceURL}/refresh`, {
          refreshToken: currRefreshToken,
        });

        // 1. Update storage with the NEW pair from your backend
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // 2. Update the header of the failed request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // 3. RETRY the original request with the new token
        return authApi(originalRequest);
      } catch (refreshError) {
        // If the refresh token is expired or deleted, the user MUST log in again
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
