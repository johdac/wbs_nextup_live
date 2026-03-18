import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { AuthShowcase } from "../ui/AuthShowcase";
import { ErrorMessage } from "../ui/ErrorMessage";

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "organizer";
}

const getUsernameValidationRules = () => ({
  required: "Username is required",
});

const getEmailValidationRules = () => ({
  required: "Email is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email",
  },
});

const getPasswordValidationRules = () => ({
  required: "Password is required",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters.",
  },
  validate: {
    hasLowercase: (value: string) =>
      /[a-z]/.test(value) ||
      "Password must include at least one lowercase letter.",
    hasUppercase: (value: string) =>
      /[A-Z]/.test(value) ||
      "Password must include at least one uppercase letter.",
    hasNumber: (value: string) =>
      /[0-9]/.test(value) || "Password must include at least one number.",
  },
});

const getConfirmPasswordValidationRules = (watchedPassword: string) => ({
  required: "Please confirm your password",
  validate: (value: string) =>
    value === watchedPassword || "Passwords do not match",
});

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
                    Create Account
                  </h1>
                  <p className="text-purple-light text-sm">
                    Join us to discover amazing events
                  </p>
                </div>
                {/* Error Message */}
                {error && <ErrorMessage message={error} />}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label
                      className="text-secondary-foreground"
                      htmlFor="username"
                    >
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="username"
                        className="pl-10"
                        type="text"
                        {...register("username", getUsernameValidationRules())}
                        placeholder="Enter your username"
                      ></Input>
                    </div>
                    {errors.username && (
                      <p className="text-red-800 text-xs">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      className="text-secondary-foreground"
                      htmlFor="email"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        className="pl-10"
                        type="email"
                        {...register("email", getEmailValidationRules())}
                        placeholder="john@gmail.com"
                      ></Input>
                    </div>
                    {errors.email && (
                      <p className="text-red-800 text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
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
                        {...register("password", getPasswordValidationRules())}
                        placeholder="••••••••"
                        className="pl-10"
                      ></Input>
                    </div>
                    {errors.password && (
                      <p className="text-red-800 text-xs">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      className="text-secondary-foreground"
                      htmlFor="confirm-password"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        className="pl-10"
                        type="password"
                        {...register(
                          "confirmPassword",
                          getConfirmPasswordValidationRules(password),
                        )}
                        placeholder="••••••••"
                      ></Input>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-800 text-xs">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-3 pt-2">
                    <div className="flex gap-10 justify-center">
                      <Label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="user"
                          {...register("role")}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm">Event Attendee</span>
                      </Label>
                      <Label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="organizer"
                          {...register("role")}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm">Event Organizer</span>
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-600 ">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-blue-500 cursor-pointer hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Design Section */}
        <AuthShowcase
          headline="Discover Your Next"
          highlightedText="Live Show"
          description="Join thousands of music fans exploring upcoming events in your city. Build your perfect night out."
          leftBadge="Join Now"
          rightBadge="Free Access"
          features={["Unlimited Event Access", "Personalized Recommendations"]}
        />
      </div>
    </div>
  );
};
