import { Router } from "express";
import {
  validateBody,
  authenticate,
  authorize,
  loadArtist,
  validateRouteParams,
} from "#middleware";
import { artistSchema, idParamSchema } from "#schema";
import {
  artistCreate,
  artistDelete,
  artistGetAll,
  artistGetOne,
  artistUpdate,
} from "#controllers/artistController";

export const artistRoutes = Router();

artistRoutes
  .route("/")
  .get(artistGetAll)
  .post(
    authenticate,
    authorize("organizer"),
    validateBody(artistSchema),
    artistCreate,
  );

artistRoutes
  .route("/:id")
  .delete(validateRouteParams(idParamSchema), artistDelete)
  .get(validateRouteParams(idParamSchema), artistGetOne)
  .put(
    validateRouteParams(idParamSchema),
    validateBody(artistSchema),
    artistUpdate,
  );
