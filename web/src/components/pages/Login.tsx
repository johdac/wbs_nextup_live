import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { AuthShowcase } from "../ui/AuthShowcase";
import { ErrorMessage } from "../ui/ErrorMessage";
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center px-4 min-h-screen md:min-h-full">
            <div className="w-full max-w-md">
              <div className="bg-gray-100 backdrop-blur-sm rounded-lg p-8 border border-primary/20">
                <div className="text-center space-y-2 mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Welcome Back
                  </h1>
                  <p className="text-purple-light text-sm">
                    Sign in to your account
                  </p>
                </div>
                {/* Error Message */}
                {error && <ErrorMessage message={error} />}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                  <div className="pb-3">
                    {/* Email */}
                    <div className="mb-2">
                      <Label
                        className="text-secondary-foreground"
                        htmlFor="email"
                      >
                        Email
                      </Label>
                      {/* <label className="text-sm font-medium text-secondary-foreground mb-1 block">
                      Email
                    </label> */}
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          className="pl-10"
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                          })}
                          placeholder="john@gmail.com"
                        ></Input>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-1">
                      <Label
                        className="text-secondary-foreground"
                        htmlFor="password"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          {...register("password", {
                            required: "Password is required",
                          })}
                          placeholder="••••••••"
                          className="pl-10"
                        ></Input>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Logging In..." : "Login"}
                  </Button>

                  {/* Sign up link */}
                  <p className="text-center text-sm text-gray-600 pt-1 ">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-500 cursor-pointer hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Design Section */}
        <AuthShowcase
          headline="Welcome to"
          highlightedText="NextUp Live"
          description="Discover upcoming live events, build your perfect night out, and never miss a show you love."
          leftBadge="Explore Shows"
          rightBadge="Get Playlist"
          features={[
            "Find Events Near You",
            "Create Playlists",
            "Never Miss a Show",
          ]}
        />
      </div>
    </div>
  );
};
