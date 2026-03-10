import { Router } from "express";
import { authenticate } from "#middleware";
import { uploadPresign } from "#controllers";

export const uploadRoutes = Router();

uploadRoutes.route("/presign").post(authenticate, uploadPresign);
