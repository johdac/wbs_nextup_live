import { Event, User, Location, Artist } from "#models";
import { assertExists } from "#utils";
import type { RequestHandler } from "express";

export const eventCreate: RequestHandler = async (req, res) => {
  // Setting the createdBy value of the request to the current user we attached in authenticate
  assertExists(req.user);
  req.body.createdBy = req.user.id;

  // Making sure that all linked entries exist
  const { location, artists } = req.body;
  const [locationExists] = await Promise.all([
    Location.exists({ _id: location }),
  ]);
  if (!locationExists)
    throw new Error("Location does not exist", { cause: { status: 400 } });
  const artistCount = await Artist.countDocuments({
    _id: { $in: artists },
  });
  if (artistCount !== artists.length)
    throw new Error("One or more artists do not exist", {
      cause: { status: 400 },
    });

  // Create Event
  const event = await Event.create(req.body);

  // Response should be populated so that we can build ui easier
  const populatedEvent = await Event.findById(event.id)
    .populate("createdBy", "username")
    .populate("location", "geo title")
    .populate("artists", "name genres description musicUrls");

  res.json(populatedEvent);
};

export const eventGetAll: RequestHandler = async (req, res) => {
  const event = await Event.find().populate("createdBy", "username");
  res.json(event);
};

export const eventGetOne: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const event = await Event.findById(id).populate("createdBy", "username");
  if (!event)
    throw new Error(`Event with id of ${id} doesn't exist`, {
      cause: { status: 404 },
    });
  res.json(event);
};

export const eventUpdate: RequestHandler = async (req, res) => {
  /**
   * First we destructure the data we should already have from the loader. The loader should have
   * checked that we do have an artist stored on the request for the id of params. Also the authentication
   * must have stored a user on the request.
   */
  const {
    params: { id },
    body: { location, artists, title, startDate, endDate, description },
    event,
  } = req;

  // Check required references
  if (location) {
    const locationExists = await Location.exists({ _id: location });
    if (!locationExists)
      throw new Error("Location does not exist", { cause: { status: 400 } });
  }

  if (artists && artists.length > 0) {
    const artistCount = await Artist.countDocuments({
      _id: { $in: artists },
    });
    if (artistCount !== artists.length)
      throw new Error("One or more artists do not exist", {
        cause: { status: 400 },
      });
  }

  assertExists(event);
  if (location) event.location = location;
  if (artists) event.artists = artists;
  if (title) event.title = title;
  if (startDate) event.startDate = startDate;
  if (endDate) event.endDate = endDate;
  if (description) event.description = description;

  await event.save();
  res.json(event);
};

export const eventDelete: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;

  await Event.findByIdAndDelete(id);
  res.json({ success: `Event with id of ${id} was deleted` });
};
