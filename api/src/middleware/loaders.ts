import type { RequestHandler } from "express";
import { Location, Event, Artist } from "#models";

export const loadLocation: RequestHandler = async (req, _res, next) => {
  const location = await Location.findById(req.params.id);
  if (!location)
    throw new Error("Location not found", { cause: { status: 404 } });
  req.createdBy = location.createdBy;
  req.location = location;
  next();
};

export const loadEvent: RequestHandler = async (req, _res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new Error("Event not found", { cause: { status: 404 } });
  req.createdBy = event.createdBy;
  req.event = event;
  next();
};

export const loadArtist: RequestHandler = async (req, _res, next) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) throw new Error("Artist not found", { cause: { status: 404 } });
  req.createdBy = artist.createdBy;
  req.artist = artist;
  next();
};
