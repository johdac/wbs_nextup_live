import axios from "axios";
import { authApi } from "./auth.service";
type TokenRes = { accessToken: string; refreshToken: string; role: string };

export const authService = {
  login: async (credentials: LoginInput) => {
    try {
      const { data } = await authApi.post<TokenRes>("/login", credentials);
      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 400) {
          throw new Error("Invalid email or password");
        } else if (err.response?.status) {
          throw new Error(
            `Error: ${err.response.status} - ${err.response.statusText}`,
          );
        }
      }
      throw err;
    }
  },
  register: async (formData: RegisterFormState) => {
    const { data } = await authApi.post<TokenRes>("/register", formData);
    return data;
  },
  getMe: async () => {
    const { data } = await authApi.get<{ user: User }>("/me");
    return data.user || data || null;
  },
  logout: async (refreshToken: string) => {
    await authApi.post("/logout", { refreshToken });
  },
};
