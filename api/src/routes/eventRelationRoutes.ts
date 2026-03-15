import { Router } from "express";
import { authenticate, validateBody, validateRouteParams } from "#middleware";
import { eventRelationUpsert, eventRelationDelete } from "#controllers";
import { idParamSchema, eventRelationSchema } from "#schema";

export const eventRelationRoutes = Router();

// No need to authorize. All requests will always alter entries for the currently authenticated user
eventRelationRoutes
  .route("/:id")
  .put(
    validateRouteParams(idParamSchema),
    authenticate,
    validateBody(eventRelationSchema),
    eventRelationUpsert,
  )
  .delete(
    validateRouteParams(idParamSchema),
    authenticate,
    eventRelationDelete,
  );
