import { z } from "zod/v4";

const emailSchema = z
  .email({ error: "Please provide a valid email address." })
  .trim()
  .toLowerCase();

const basePasswordSchema = z
  .string({ error: "Password must be a string" })
  .min(8, { error: "Password must be at least 8 characters." })
  .max(512, { error: "The length of this Password is excessive." });

const serviceSchema = z.string().max(128).optional();

export const registerSchema = z
  .object(
    {
      email: emailSchema,
      role: z.enum(["user", "organizer"], {
        error: "Role must be either user or organizer.",
      }),
      password: basePasswordSchema
        .regex(/[a-z]/, {
          error: "Password must include at least one lowercase letter.",
        })
        .regex(/[A-Z]/, {
          error: "Password must include at least one uppercase letter.",
        })
        .regex(/[0-9]/, {
          error: "Password must include at least one number.",
        }),

      confirmPassword: z.string(),
      username: z.string().min(3).max(50),
    },
    { error: "Please provide a valid email and a secure password." },
  )
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: basePasswordSchema,
});
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
