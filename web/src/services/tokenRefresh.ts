import axios from "axios";

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

let refreshRequestPromise: Promise<RefreshResponse> | null = null;

export const clearAuthSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
};

export const isRefreshTokenInvalidError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  return status === 400 || status === 401 || status === 403;
};

export const refreshAccessToken = async (): Promise<RefreshResponse> => {
  if (refreshRequestPromise) {
    return refreshRequestPromise;
  }

  refreshRequestPromise = (async () => {
    const authServiceURL = import.meta.env.VITE_APP_AUTH_SERVER_URL;
    const currentRefreshToken = localStorage.getItem("refreshToken");

    if (!currentRefreshToken) {
      throw new Error("Missing refresh token");
    }

    const { data } = await axios.post<RefreshResponse>(
      `${authServiceURL}/refresh`,
      {
        refreshToken: currentRefreshToken,
      },
    );

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  })();

  try {
    return await refreshRequestPromise;
  } finally {
    refreshRequestPromise = null;
  }
};
