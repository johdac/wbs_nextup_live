import { Router } from "express";
import { authenticate, validateBody } from "#middleware";
import { uploadPresign } from "#controllers";
import { uploadPresignBodySchema } from "#schema";

export const uploadRoutes = Router();

uploadRoutes
  .route("/presign")
  .post(authenticate, validateBody(uploadPresignBodySchema), uploadPresign);
