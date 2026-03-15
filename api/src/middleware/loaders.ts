import type { RequestHandler } from "express";
import { Location, Event, Artist, User } from "#models";
import { assertExists } from "#utils";

/**
 * These run in the routes after authentication but before authorization to attach
 * the data for the resource that is supposed to be edited. Then in the auhtorization
 * we can compare for examply if the owner of the resource is the same as the current
 * user.
 */

export const loadLocation: RequestHandler = async (req, _res, next) => {
  const location = await Location.findById(req.params.id);
  if (!location)
    throw new Error("Location not found", { cause: { status: 404 } });
  req.createdById = location.createdById;
  req.location = location;
  next();
};

export const loadEvent: RequestHandler = async (req, _res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new Error("Event not found", { cause: { status: 404 } });
  req.createdById = event.createdById;
  req.event = event;
  next();
};

export const loadArtist: RequestHandler = async (req, _res, next) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) throw new Error("Artist not found", { cause: { status: 404 } });
  req.createdById = artist.createdById;
  req.artist = artist;
  next();
};

export const loadUser: RequestHandler = async (req, _res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new Error("User not found", { cause: { status: 404 } });
  req.createdById = user._id; // Users create themselves
  req.requestedUser = user;
  next();
};
