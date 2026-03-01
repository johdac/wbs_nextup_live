import { Router } from "express";
import {
  authenticate,
  authorize,
  loadArtist,
  validateBody,
  validateRouteParams,
} from "#middleware";
import { artistSchema, artistUpdateSchema, idParamSchema } from "#schema";
import {
  artistCreate,
  artistDelete,
  artistGetAll,
  artistGetOne,
  artistUpdate,
} from "#controllers";

export const artistRoutes = Router();

// prettier-ignore
artistRoutes
  .route("/")
  .post(
    authenticate,
    authorize("organizer"),
    validateBody(artistSchema),
    artistCreate,
  )
  .get(artistGetAll)

// prettier-ignore
artistRoutes
  .route("/:id")
  .get(
    validateRouteParams(idParamSchema),
    artistGetOne
  )
  .put(
    validateRouteParams(idParamSchema),
    authenticate,
    loadArtist,
    authorize("self"),
    validateBody(artistUpdateSchema),
    artistUpdate,
  )
  .delete(
    validateRouteParams(idParamSchema),
    authenticate,
    loadArtist,
    authorize("self"),
    artistDelete,
  );
