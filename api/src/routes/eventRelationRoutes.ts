import { Router } from "express";
import { authenticate, validateBody, validateRouteParams } from "#middleware";
import { eventRelationCreate, eventRelationDelete } from "#controllers";
import { idParamSchema, eventRelationSchema } from "#schema";

export const eventRelationRoutes = Router();

// No need to authorize. All requests will always add entries for the currently authenticated user
eventRelationRoutes
  .route("/:id")
  .post(
    validateRouteParams(idParamSchema),
    authenticate,
    validateBody(eventRelationSchema),
    eventRelationCreate,
  )
  .delete(
    validateRouteParams(idParamSchema),
    authenticate,
    eventRelationDelete,
  );
