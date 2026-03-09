import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authApi";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

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

  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: authService.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!localStorage.getItem("accessToken"),
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
    isLoading: isLoading || isFetching,
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
