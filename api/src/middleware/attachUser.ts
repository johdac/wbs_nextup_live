import { User } from "#models";
import type { Request, Response, NextFunction } from "express";

type Auth0Claims = {
  sub: string;
  email?: string;
  name?: string;
  nickname?: string;
  preferred_username?: string;
};

declare global {
  namespace Express {
    interface Request {
      userDoc?: any;
    }
  }
}

export async function attachUser(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.auth?.payload as any;
    const auth0Id = payload?.sub;

    if (!auth0Id) return res.status(401).json({ error: "Missing sub in token" });

    // token does not have email, get from body
    const email = payload?.email ?? req.body?.email;
    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    // use email prefix as username
    const base = email.split("@")[0];

    // find auth0Id
    let user = await User.findOne({ auth0Id });
    if (user) {
      req.userDoc = user;
      return next();
    }

    // first time: create an account
    let username = base;
    let i = 1;
    while (await User.exists({ username })) {
      i += 1;
      username = `${base}${i}`;
    }

    // upsert: If user exist, it will combin with auth0Id
    user = await User.findOneAndUpdate(
      { auth0Id },
      {
        $setOnInsert: {
          auth0Id,
          email,
          username,
          role: "user",
        },
      },
      { new: true, upsert: true },
    );

    req.userDoc = user;
    next();
  } catch (err: any) {
    next(err);
  }
}
