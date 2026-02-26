import { Router } from "express";
import { validateBody } from "#middleware";
import { authenticate } from "#middleware";
import { eventGetAll, eventCreate } from "#controllers";

export const eventRoutes = Router();

eventRoutes
  .route("/")
  .post(authenticate, eventCreate) // TODO Add validation
  .get(eventGetAll);
