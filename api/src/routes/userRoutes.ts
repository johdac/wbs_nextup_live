import { Router } from "express";
import {
  authenticate,
  authorize,
  loadUser,
  validateBody,
  validateRouteParams,
} from "#middleware";
import { idParamSchema, userUpdateSchema } from "#schema";
import { userUpdate } from "#controllers";

export const userRoutes = Router();

userRoutes
  .route("/:id")
  .put(
    validateRouteParams(idParamSchema),
    authenticate,
    loadUser,
    authorize("self"),
    validateBody(userUpdateSchema),
    userUpdate,
  );
