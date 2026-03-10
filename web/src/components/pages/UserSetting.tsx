import { User, Lock, Mail, CircleAlert } from "lucide-react";
import { useState } from "react";

export const UserSetting = () => {
  const [errors, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="container mx-auto">
        <div className="flex items-center justify-center px-4 min-h-screen md:min-h-full">
          <div className="w-full max-w-md">
            <div className="bg-gray-100 backdrop-blur-sm rounded-lg p-8 border border-primary/20">
              <div className="flex justify-center">
                <h2 className="mb-2 flex items-center font-display text-2xl font-bold tracking-widersm:text-3xl">
                  <User className="h-8 w-8 mr-2" />
                  <div className="text-3xl font-bold">PROFILE</div>
                </h2>
              </div>
              <form className="space-y-4">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-foreground mb-1 block">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter your username"
                      className="input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                  {/* {errors.username && <p className="text-red-800 text-xs">{errors.username.message}</p>} */}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-foreground mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      className="input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                  {/* {errors.email && <p className="text-red-800 text-xs">{errors.email.message}</p>} */}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-foreground mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input-default pl-10  focus:border-primary w-full"
                    />
                  </div>
                  {/* {errors.password && <p className="text-red-800 text-xs">{errors.password.message}</p>} */}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-foreground mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input-default pl-10 focus:border-primary w-full"
                    />
                  </div>
                  {/* {errors.confirmPassword && <p className="text-red-800 text-xs">{errors.confirmPassword.message}</p>} */}
                </div>

                {/* Role Selection */}
                <div className="space-y-3 pt-2">
                  {/* <label className="text-sm font-medium text-black block">
                    I am a
                  </label> */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="user" className="w-4 h-4 cursor-pointer" />
                      <span className="text-sm">Event Attendee</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="organizer" className="w-4 h-4 cursor-pointer" />
                      <span className="text-sm">Event Organizer</span>
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {/* {error && (
          <div className="p-3 flex items-center rounded-lg bg-red-500/20 border border-red-500 text-red-800 text-sm">
            <CircleAlert className="text-red pr-2" /> {error}
          </div>
        )} */}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 btn-default hover:opacity-90 disabled:opacity-50 transition"
                >
                  {loading ? "Saving Account..." : "Save"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
