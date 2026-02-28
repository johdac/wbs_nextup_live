import { Event } from "#models";
import type { RequestHandler } from "express";

export const eventCreate: RequestHandler = async (req, res) => {
  const data = await Event.create(req.body);
  res.json(data);
};

export const eventGetAll: RequestHandler = async (req, res) => {
  const scores = await Event.find().populate("createdBy", "username");
  res.json(scores);
};

export const eventGetOne: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const event = await Event.findById(id).populate("createdBy", "username");
  if (!event)
    throw new Error(`Event with id of ${id} doesn't exist`, { cause: 404 });
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

  if (!event)
    throw new Error(`Event with id of ${id} doesn't exist`, { cause: 404 }); // Just for TS
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
    event,
  } = req;

  if (!event)
    throw new Error(`Event with id of ${id} doesn't exist`, { cause: 404 });
  await Event.findByIdAndDelete(id);
  res.json({ success: `Event with id of ${id} was deleted` });
};
