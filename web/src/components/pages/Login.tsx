import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface LoginFormInputs {
  email: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleSignIn } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";

  const { register, handleSubmit, reset } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    setError("");
    try {
      await handleSignIn(data);
      reset();
      navigate(from, { replace: true });
    } catch (err) {
      reset();
      setError(err instanceof Error ? err.message : "An error occurred");
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
                <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-purple-light text-sm">
                  Sign in to your account
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      {...register("email", { required: "Email is required" })}
                      placeholder="john@gmail.com"
                      className="input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
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
                  {loading ? "Signing In..." : "Sign In"}
                </button>

                {/* Sign up link */}
                <p className="text-center text-sm text-muted-foreground pt-4">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
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
                Welcome to
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-yellow-400 to-pink-400">
                  NextUp Live
                </span>
              </h2>

              <p className="text-gray-200 text-lg leading-relaxed">
                Discover upcoming live events, build your perfect night out, and
                never miss a show you love.
              </p>
            </div>

            {/* Floating Elements */}
            <div className="relative h-32 flex items-center justify-center">
              {/* Top Left Badge */}
              <div className="absolute top-0 left-0 bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform -rotate-12">
                Explore Shows
              </div>

              {/* Bottom Right Badge */}
              <div className="absolute bottom-0 right-0 bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform rotate-12">
                Get Playlist
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
                <span className="text-white text-sm">Find Events Near You</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span className="text-white text-sm">Create Playlists</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-white text-sm">Never Miss a Show</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
