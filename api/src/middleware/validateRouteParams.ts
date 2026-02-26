import type { RequestHandler } from "express";
import { z, type ZodObject } from "zod/v4";

export const validateRouteParams = (zodSchema: ZodObject): RequestHandler => {
  return (req, res, next) => {
    const { data, error, success } = zodSchema.safeParse(req.params);
    if (!success)
      throw new Error(z.prettifyError(error), { cause: { status: 400 } });
    else next();
  };
};
