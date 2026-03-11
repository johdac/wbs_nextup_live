import axios from "axios";
import { authApi } from "./auth.service";
type TokenRes = { accessToken: string; refreshToken: string; role?: string };

const normalizeAuthResponse = (payload: any): TokenRes => {
  const role = payload?.role ?? payload?.user?.role ?? payload?.roles?.[0] ?? undefined;

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    role,
  };
};

export const authService = {
  login: async (credentials: LoginInput) => {
    try {
      const { data } = await authApi.post<TokenRes>("/login", credentials);
      return normalizeAuthResponse(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Check if the backend sent an error message
        // if (err.response?.data?.message) {
        //   throw new Error(err.response.data.message);
        // } else if (err.response?.data) {
        //   // Try to extract any error info from the response
        //   const errorData = err.response.data as any;
        //   if (typeof errorData === "string") {
        //     throw new Error(errorData);
        //   } else if (errorData.error) {
        //     throw new Error(errorData.error);
        //   }
        // }

        if (err.response?.status === 401 || err.response?.status === 400) {
          throw new Error("Invalid email or password");
        } else if (err.response?.status) {
          throw new Error(`Error: ${err.response.status} - ${err.response.statusText}`);
        }
      }
      throw err;
    }
  },
  register: async (formData: RegisterFormState) => {
    try {
      const { data } = await authApi.post<TokenRes>("/register", formData);
      return normalizeAuthResponse(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Check if the backend sent an error message
        if (err.response?.data?.message) {
          throw new Error(err.response.data.message);
        } else if (err.response?.data) {
          // Try to extract any error info from the response
          const errorData = err.response.data as any;
          if (typeof errorData === "string") {
            throw new Error(errorData);
          } else if (errorData.error) {
            throw new Error(errorData.error);
          }
        }

        // Fallback to status-based messages
        if (err.response?.status === 400) {
          throw new Error("Invalid registration data");
        } else if (err.response?.status) {
          throw new Error(`Error: ${err.response.status} - ${err.response.statusText}`);
        }
      }
      throw err;
    }
  },
  getMe: async () => {
    const { data } = await authApi.get<{ user: User }>("/me");
    return data.user || data || null;
  },
  logout: async (refreshToken: string) => {
    await authApi.post("/logout", { refreshToken });
  },
  updateMe: async (payload: { username: string; email: string; role: "user" | "organizer"; password?: string }) => {
    const { data } = await authApi.put("/me", payload);
    return data;
  },
};
