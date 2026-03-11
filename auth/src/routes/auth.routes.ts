import { Router } from "express";
import { login, logout, me, refresh, register, update } from "#controllers";
import { requireAuth, validateBodyZod } from "#middleware";
import { loginSchema, registerSchema, refreshTokenSchema, updateMeSchema } from "#schemas"; // TODO: use the schemas for validation

const authRoutes = Router();

authRoutes.post("/register", validateBodyZod(registerSchema), register);

authRoutes.post("/login", validateBodyZod(loginSchema), login);

authRoutes.post("/refresh", validateBodyZod(refreshTokenSchema), refresh);

authRoutes.delete("/logout", validateBodyZod(refreshTokenSchema), logout);

authRoutes.get("/me", requireAuth, me);

authRoutes.put("/me", requireAuth, validateBodyZod(updateMeSchema), update);

export default authRoutes;
