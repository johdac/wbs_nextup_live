import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "organizer";
}

export const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const password = watch("password");

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setLoading(true);
    setError("");

    try {
      await handleRegister(data);
      reset();
      navigate("/");
    } catch (err) {
      reset();
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Logo - Top Left */}
      <Link to="/" className="absolute top-8 left-8 z-50">
        <div className="text-2xl sm:text-4xl font-black italic tracking-tighter text-white hover:opacity-80 transition">
          NextUp Live<span className="not-italic ml-1">✦</span>
        </div>
      </Link>

      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
        {/* Left Column - Form */}
        <div className="flex items-center justify-center px-4 min-h-screen md:min-h-full">
          <div className="w-full max-w-md">
            <div className="bg-gray-100 backdrop-blur-sm rounded-lg p-8 border border-primary/20">
              <div className="text-center space-y-2 mb-6">
                <h1 className="text-3xl font-bold">Create Account</h1>
                <p className="text-purple-light text-sm">
                  Join us to discover amazing events
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      {...register("username", {
                        required: "Username is required",
                      })}
                      placeholder="Enter your username"
                      className="input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-400 text-xs">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email",
                        },
                      })}
                      placeholder="john@gmail.com"
                      className="input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      placeholder="••••••••"
                      className="input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      placeholder="••••••••"
                      className="input-default pl-10 focus:border-primary w-full"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
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
                        {...register("role")}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm">Event Attendee</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="organizer"
                        {...register("role")}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm">Event Organizer</span>
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 btn-default hover:opacity-90 disabled:opacity-50 transition"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-muted-foreground pt-2">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-primary hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Design Section */}
        <div className="hidden md:flex bg-linear-to-br from-purple-600 via-blue-600 to-purple-700 h-full rounded-lg overflow-hidden items-center justify-center relative p-8">
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-6 max-w-md">
            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Discover Your Next
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-yellow-400 to-pink-400">
                  Live Show
                </span>
              </h2>

              <p className="text-gray-200 text-lg leading-relaxed">
                Join thousands of music fans exploring upcoming events in your
                city. Build your perfect night out.
              </p>
            </div>

            {/* Floating Elements */}
            <div className="relative h-32 flex items-center justify-center">
              {/* Top Left Badge */}
              <div className="absolute top-0 left-0 bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform -rotate-12">
                Join Now
              </div>

              {/* Bottom Right Badge */}
              <div className="absolute bottom-0 right-0 bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform rotate-12">
                Free Access
              </div>

              {/* Center Icon */}
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <span className="text-3xl">✦</span>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white text-sm">
                  Unlimited Event Access
                </span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span className="text-white text-sm">
                  Personalized Recommendations
                </span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-white text-sm"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
