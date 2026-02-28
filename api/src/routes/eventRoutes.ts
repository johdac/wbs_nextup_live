import { Router } from "express";
import {
  authenticate,
  authorize,
  loadEvent,
  validateBody,
  validateRouteParams,
} from "#middleware";
import {
  eventCreate,
  eventDelete,
  eventGetAll,
  eventGetOne,
  eventUpdate,
} from "#controllers";
import { eventSchema, idParamSchema } from "#schema";

export const eventRoutes = Router();

// prettier-ignore
eventRoutes
  .route("/")
  .post(
    // authenticate,
    // authorize("organizer"),
    validateBody(eventSchema),
    eventCreate
  )
  .get(eventGetAll);

// prettier-ignore
eventRoutes
  .route("/:id")
  .get(validateRouteParams(idParamSchema), eventGetOne)
  .put(
    validateRouteParams(idParamSchema),
    // authenticate,
    // authorize("self"),
    loadEvent,
    validateBody(eventSchema),
    eventUpdate,
  )
  .delete(
    validateRouteParams(idParamSchema),
    // authenticate,
    // authorize("self"),
    loadEvent,
    eventDelete,
  )
