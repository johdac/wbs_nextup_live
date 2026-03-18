import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authApi";
import { clearAuthSession, refreshAccessToken } from "../services/tokenRefresh";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);

  const persistAuthSession = (
    accessToken: string,
    refreshToken: string,
    role?: string,
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    if (role) {
      localStorage.setItem("role", role);
    }
  };

  // Initialize auth by refreshing token if available
  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      // If we have an access token, we're already initialized
      if (accessToken) {
        setIsInitializing(false);
        return;
      }

      // If we have a refresh token, try to refresh the access token
      if (refreshToken) {
        try {
          const data = await refreshAccessToken();
          persistAuthSession(data.accessToken, data.refreshToken);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // If refresh fails, clear tokens
          clearAuthSession();
        }
      }

      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: authService.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !isInitializing && !!localStorage.getItem("accessToken"),
  });

  // const loginMutation = useMutation({
  //   mutationFn: authService.login,
  //   onSuccess: (data) => {
  //     localStorage.setItem("accessToken", data.accessToken);
  //     localStorage.setItem("refreshToken", data.refreshToken);
  //     queryClient.invalidateQueries({ queryKey: ["authUser"] });
  //   },
  // });
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      persistAuthSession(data.accessToken, data.refreshToken, data.role);

      try {
        const currentUser = await authService.getMe();
        const resolvedRole =
          data.role ?? currentUser?.role ?? currentUser?.roles?.[0];

        if (resolvedRole) {
          localStorage.setItem("role", resolvedRole);
        }
        queryClient.setQueryData(["authUser"], currentUser);
      } catch {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async (data) => {
      persistAuthSession(data.accessToken, data.refreshToken, data.role);

      try {
        const currentUser = await authService.getMe();
        const resolvedRole =
          data.role ?? currentUser?.role ?? currentUser?.roles?.[0];

        if (resolvedRole) {
          localStorage.setItem("role", resolvedRole);
        }
        queryClient.setQueryData(["authUser"], currentUser);
      } catch {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }
    },
  });
  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("refreshToken");
      // Even if this returns 404, the catch/finally will handle the local cleanup
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.log(error);
      console.warn("Server-side logout failed, performing local cleanup only.");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      queryClient.setQueryData(["authUser"], null);
      queryClient.removeQueries({ queryKey: ["authUser"] });
      window.location.href = "/";
    }
  };

  const value = {
    user: user || null,
    signedIn: !!user,
    isLoading: isInitializing || isLoading || isFetching,
    handleSignIn: async (creds: LoginInput) => {
      await loginMutation.mutateAsync(creds);
    },
    handleRegister: async (data: RegisterFormState) => {
      await registerMutation.mutateAsync(data);
    },
    handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
