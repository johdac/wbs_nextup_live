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
      reset(); // clear form
      onClose(); // close modal
    } catch (err) {
      // Clear form on error
      reset();
      // Display error message from authService
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
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

// import { useState } from "react";
// import { Lock, Mail, User, X } from "lucide-react";
// import { Dialog, DialogContent } from "@mui/material";
// import { motion } from "framer-motion";

// interface LoginModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// export const LoginModal = ({ open, onClose }: LoginModalProps) => {
//   const [isSignup, setIsSignup] = useState(true);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "user",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError("");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const url = isSignup
//         ? "http://localhost:1093/auth/register"
//         : "http://localhost:1093/auth/login";

//       const payload = isSignup
//         ? formData
//         : {
//             email: formData.email,
//             password: formData.password,
//           };

//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Authentication failed");
//       }

//       const data = await response.json();
//       console.log("Success:", data);

//       // Store tokens
//       localStorage.setItem("accessToken", data.accessToken);
//       localStorage.setItem("refreshToken", data.refreshToken);

//       // Reset form and close
//       setFormData({
//         username: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         role: "user",
//       });
//       onClose();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         className: "login-modal-paper",
//       }}
//       BackdropProps={{
//         className: "login-modal-backdrop",
//       }}
//     >
//       <DialogContent className="login-modal-content">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="pb-5">
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 p-2 hover:bg-purple cursor-pointer rounded-full transition"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           {/* Title */}
//           <div className="text-center space-y-2 mb-6">
//             <h2 className="text-2xl font-bold mb-2">
//               {isSignup ? "Join NextUp Live" : "Welcome Back"}
//             </h2>
//             <p className="text-purple-light text-sm mb-6">
//               {isSignup
//                 ? "Create an account to get started"
//                 : "Sign in to your account"}
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Signup Fields */}
//             {isSignup && (
//               <>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-foreground mb-1 block">
//                     Username
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                     <input
//                       type="text"
//                       placeholder="AshKetchum99"
//                       value={formData.username}
//                       onChange={handleInputChange}
//                       className="input-default pl-10 bg-secondary/50  focus:border-primary"
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Email */}

//             <div className="space-y-2">
//               <label className="text-sm font-medium text-foreground mb-1 block">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <input
//                   type="email"
//                   placeholder="trainer@pokebattle.com"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="input-default  pl-10 bg-secondary/50  focus:border-primary"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-foreground mb-1 block">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <input
//                   type="password"
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className="input-default  pl-10 bg-secondary/50  focus:border-primary"
//                 />
//               </div>
//             </div>

//             {/* Confirm Password (Signup only) */}
//             {isSignup && (
//               <>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-foreground mb-1 block">
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                     <input
//                       type="password"
//                       placeholder="••••••••"
//                       value={formData.confirmPassword}
//                       onChange={handleInputChange}
//                       className="input-default  pl-10 bg-secondary/50  focus:border-primary"
//                     />
//                   </div>
//                 </div>

//                 {/* Role Radio Buttons */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Role</label>
//                   <div className="role-radio-group">
//                     <div className="role-radio-option">
//                       <input
//                         type="radio"
//                         id="role-user"
//                         name="role"
//                         value="user"
//                         checked={formData.role === "user"}
//                         onChange={handleInputChange}
//                       />
//                       <label htmlFor="role-user">User</label>
//                     </div>
//                     <div className="role-radio-option">
//                       <input
//                         type="radio"
//                         id="role-organizer"
//                         name="role"
//                         value="organizer"
//                         checked={formData.role === "organizer"}
//                         onChange={handleInputChange}
//                       />
//                       <label htmlFor="role-organizer">Organizer</label>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Error Message */}
//             {error && (
//               <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-sm">
//                 {error}
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full mt-6 btn-default  hover:opacity-90  disabled:opacity-50"
//             >
//               {loading ? "Loading..." : isSignup ? "Sign Up" : "Sign In"}
//             </button>
//           </form>

//           {/* Toggle Auth Mode */}
//           <div className="mt-6 text-center">
//             <p className="text-purple-light text-sm">
//               {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
//               <button
//                 onClick={() => {
//                   setIsSignup(!isSignup);
//                   setError("");
//                 }}
//                 className="text-white font-medium hover:underline"
//               >
//                 {isSignup ? "Sign In" : "Sign Up"}
//               </button>
//             </p>
//           </div>
//         </motion.div>
//       </DialogContent>
//     </Dialog>
//   );
// };
