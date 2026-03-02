import type { Request, Response, NextFunction } from "express";

export function requireRole(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { roles?: string[] } | undefined;

    if (!user?.roles?.length) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ok = user.roles.some((r) => allowed.includes(r));
    if (!ok) return res.status(403).json({ message: "Forbidden" });

    next();
  };
}
