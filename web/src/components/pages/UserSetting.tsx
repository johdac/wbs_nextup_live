import { User, Lock, Mail, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "../../services/authApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const UserSetting = () => {
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "organizer">("user");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: authService.getMe,
  });

  useEffect(() => {
    if (!profile) return;

    setUsername(profile.username ?? "");
    setEmail(profile.email ?? "");
    setRole(profile.role === "organizer" ? "organizer" : "user");
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateMe,
    onSuccess: async (updatedProfile) => {
      setSuccess("Profile updated successfully");
      setError("");
      setPassword("");
      setConfirmPassword("");

      await queryClient.invalidateQueries({ queryKey: ["me"] });

      setUsername(updatedProfile.username ?? "");
      setEmail(updatedProfile.email ?? "");
      setRole(updatedProfile.role === "organizer" ? "organizer" : "user");
    },
    onError: (err: unknown) => {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setSuccess("");
      setError(error?.response?.data?.message || error?.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (password || confirmPassword) {
      if (!password || !confirmPassword) {
        setError("Please fill in both password fields");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    updateProfileMutation.mutate({
      username,
      email,
      role,
      ...(password ? { password } : {}),
    });
  };

  if (isLoading) {
    return <div className="container mx-auto p-6 text-white">Loading profile...</div>;
  }

  if (isError) {
    return <div className="container mx-auto p-6 text-red-500">Failed to load profile.</div>;
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="pb-10 flex items-center justify-center px-4 min-h-screen md:min-h-full">
          <div className="w-full max-w-md">
            <div className="bg-gray-100 backdrop-blur-sm rounded-lg p-8 border border-primary/20">
              <div className="flex justify-center">
                <h2 className="mb-2 flex items-center font-display text-3xl font-bold tracking-widersm:text-3xl">
                  Update Profile
                </h2>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-foreground mb-1 block">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-foreground mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@gmail.com"
                      className="input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-foreground mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-foreground mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-default pl-10 focus:border-primary w-full"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-3 pt-2">
                  {/* <label className="text-sm font-medium text-black block">
                    I am a
                  </label> */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="user"
                        checked={role === "user"}
                        onChange={(e) => setRole(e.target.value as "user" | "organizer")}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm">Event Attendee</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="organizer"
                        checked={role === "organizer"}
                        onChange={(e) => setRole(e.target.value as "user" | "organizer")}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm">Event Organizer</span>
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 flex items-center rounded-lg bg-red-500/20 border border-red-500 text-red-800 text-sm">
                    <CircleAlert className="text-red pr-2" /> {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-lg border border-green-500 bg-green-500/20 p-3 text-sm text-green-700">
                    {success}
                  </div>
                )}

                {/* Submit Button */}

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full mt-6 btn-default hover:opacity-90 disabled:opacity-50 transition"
                >
                  {updateProfileMutation.isPending ? "Saving Profile..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
