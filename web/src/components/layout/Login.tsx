import { useState } from "react";
import { Lock, Mail, X } from "lucide-react";
import { Dialog, DialogContent } from "@mui/material";
import { motion } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import { authService } from "../../services/authApi";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

interface LoginFormInputs {
  email: string;
  password: string;
}

export const Login = ({ open, onClose }: LoginModalProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    setError("");
    try {
      await authService.login(data); // tokens handled inside authService
      reset();
      onClose();
    } catch (err) {
      reset();
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: "login-modal-paper" }}
      BackdropProps={{ className: "login-modal-backdrop" }}
    >
      <DialogContent className="login-modal-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pb-5">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-purple cursor-pointer rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-purple-light text-sm mb-6">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  className="input-default pl-10 bg-secondary/50 focus:border-primary"
                />
              </div>
            </div>

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
                  className="input-default pl-10 bg-secondary/50 focus:border-primary"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 btn-default hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-muted-foreground pt-4">
              Don't have an account?{" "}
              <a href="/register" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
