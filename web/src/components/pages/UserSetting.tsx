import { User, Lock, Mail, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "../../services/authApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

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
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile",
      );
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
    return (
      <div className="container mx-auto p-6 text-white">Loading profile...</div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6 text-red-500">
        Failed to load profile.
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="pb-10 flex items-center justify-center px-4 min-h-screen md:min-h-full">
          <div className="w-full max-w-md">
            <div className="rounded-lg p-6 bg-lightgray">
              <div className="flex justify-center">
                <h2 className="pb-2 text-2xl font-bold text-white flex items-center gap-2">
                  Update Profile
                </h2>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Username */}
                <div className="space-y-2">
                  <Label className="form-label">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      variant="event"
                      className="Input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="form-label">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@gmail.com"
                      variant="event"
                      className="Input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="form-label">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      variant="event"
                      className="Input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label className="form-label">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      variant="event"
                      className="Input-default pl-10 focus:border-primary w-full"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="pt-2">
                  <div className="flex gap-10 justify-center">
                    <Label className="form-radio">
                      <input
                        type="radio"
                        value="user"
                        checked={role === "user"}
                        onChange={(e) =>
                          setRole(e.target.value as "user" | "organizer")
                        }
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm">Event Attendee</span>
                    </Label>
                    <Label className="form-radio">
                      <input
                        type="radio"
                        value="organizer"
                        checked={role === "organizer"}
                        onChange={(e) =>
                          setRole(e.target.value as "user" | "organizer")
                        }
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm">Event Organizer</span>
                    </Label>
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
                  className="w-full mt-2 btn-default hover:opacity-90 disabled:opacity-50 transition"
                >
                  {updateProfileMutation.isPending
                    ? "Saving Profile..."
                    : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
