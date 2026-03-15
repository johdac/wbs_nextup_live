import { Router } from "express";
import {
  authenticate,
  authorize,
  loadUser,
  validateBody,
  validateRouteParams,
} from "#middleware";
import { idParamSchema, userUpdateSchema } from "#schema";
import { userGetMe, userUpdate, userUpdateMe } from "#controllers";

export const userRoutes = Router();

// No need to authorize here. We ever only deal with the jwt encoded user id
userRoutes
  .route("/me")
  .get(authenticate, userGetMe)
  .put(authenticate, validateBody(userUpdateSchema), userUpdateMe);

// This is eventually for updating other users. Currently limited to self update like me route above
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
