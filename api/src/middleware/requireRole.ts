import type { Request, Response, NextFunction } from "express";

export function requireRole(...roles: Array<"user" | "admin" | "organizer">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.userDoc?.role;
    if (!role) return res.status(500).json({ error: "userDoc missing (attachUser not applied?)" });
    if (!roles.includes(role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
