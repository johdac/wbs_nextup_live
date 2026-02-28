import { Router } from "express";
import {
  authenticate,
  authorize,
  loadEvent,
  validateBody,
  validateRouteParams,
} from "#middleware";
import {
  locationCreate,
  locationDelete,
  locationGetAll,
  locationGetOne,
  locationUpdate,
} from "#controllers";
import { locationSchema, idParamSchema } from "#schema";

export const locationRoutes = Router();

// prettier-ignore
locationRoutes
  .route("/")
  .post(
    // authenticate,
    // authorize("organizer"),
    validateBody(locationSchema),
    locationCreate
  )
  .get(locationGetAll);

// prettier-ignore
locationRoutes
  .route("/:id")
  .get(validateRouteParams(idParamSchema), locationGetOne)
  .put(
    validateRouteParams(idParamSchema),
    // authenticate,
    // authorize("self"),
    validateBody(locationSchema),
    locationUpdate,
  )
  .delete(
    validateRouteParams(idParamSchema),
    // authenticate,
    // authorize("self"),
    locationDelete,
  )
