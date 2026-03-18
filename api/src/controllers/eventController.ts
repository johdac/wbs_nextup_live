import { Event, Location, Artist, EventRelation } from "#models";
import { assertExists, getPublicFileUrl } from "#utils";
import type { RequestHandler } from "express";
import { Types } from "mongoose";

// Utility for events to get the relations that users might have to them (favorite, hidden)
const getEventRelationship = async (
  userId: Types.ObjectId,
  eventIds: Types.ObjectId[],
) => {
  const relations = await EventRelation.find({
    userId,
    eventId: { $in: eventIds },
  }).lean();

  return new Map(
    relations.map((r) => [r.eventId.toString(), r.interactionType]),
  );
};

export const eventCreate: RequestHandler = async (req, res) => {
  // Setting the createdById value of the request to the current user we attached in authenticate
  assertExists(req.user);
  req.body.createdById = req.user.id;

  // Making sure that all linked entries exist
  const { locationId, artistsIds } = req.body;

  const location = await Location.findById(locationId);
  if (!location)
    throw new Error("Location does not exist", { cause: { status: 400 } });

  const artistCount = await Artist.countDocuments({
    _id: { $in: artistsIds },
  });
  if (artistCount !== artistsIds.length)
    throw new Error("One or more artists do not exist", {
      cause: { status: 400 },
    });

  // Getting the geo from location to store in the events geo
  req.body.geo = location.geo;
  req.body.locationName = location.name;

  // Getting the genres and names from selected artists, deduplicating and adding them to the request for storing
  const artists = await Artist.find({
    _id: { $in: req.body.artistsIds },
  }).select("genres name");

  const mergedGenres = [...new Set(artists.flatMap((a) => a.genres))];
  const artistNames = artists.map((a) => a.name);

  req.body.genres = mergedGenres;
  req.body.artistNames = artistNames;

  // Create Event
  const event = await Event.create(req.body);

  // Response should be populated so that we can build ui easier
  const populatedEvent = await Event.findById(event.id)
    .populate("createdById", "username")
    .populate("locationId", "title")
    .populate("artistsIds", "name genres description musicUrls");

  res.json(populatedEvent);
};

export const eventGetAll: RequestHandler = async (req, res) => {
  const {
    isFavorite,
    artistId,
    organizerId,
    genres,
    lat,
    lng,
    locationId,
    radius,
    search,
    startAfter,
    startUntil,
    page = "1",
    limit = 20,
  } = req.query;

  const filter: any = {};

  // TODO To be adapted
  // if (search && typeof search === "string") filter.$text = { $search: search };
  // if (createdById && typeof createdById === "string") filter.createdById = createdById;

  // Return only favorited events for logged in users
  if (req.user && isFavorite === "true") {
    const favorites = await EventRelation.find({
      userId: req.user.id,
      interactionType: "favorite",
    })
      .select("eventId")
      .lean();

    const favoriteIds = favorites.map((f) => f.eventId);
    filter._id = { $in: favoriteIds };
  }

  // Search by artistId
  if (artistId && typeof artistId === "string") {
    // TODO this should be moved into params validation middleware
    if (!Types.ObjectId.isValid(artistId))
      throw new Error("Invalid artistId", { cause: { status: 400 } });
    filter.artistsIds = new Types.ObjectId(artistId);
  }

  // Search by locationId
  if (locationId && typeof locationId === "string") {
    // TODO this should be moved into params validation middleware
    if (!Types.ObjectId.isValid(locationId))
      throw new Error("Invalid locationId", { cause: { status: 400 } });
    filter.locationId = new Types.ObjectId(locationId);
  }

  // Search by createdById
  if (organizerId && typeof organizerId === "string") {
    // TODO this should be moved into params validation middleware
    if (!Types.ObjectId.isValid(organizerId))
      throw new Error("Invalid organizerId", { cause: { status: 400 } });
    filter.createdById = new Types.ObjectId(organizerId);
  }

  // Search by genres
  if (genres) {
    const genreArray = typeof genres === "string" ? genres.split(",") : genres;
    filter.genres = { $in: genreArray };
  }

  // Search by start date
  if (startAfter || startUntil) {
    filter.startDate = {};
    if (startAfter) filter.startDate.$gte = new Date(startAfter as string);
    if (startUntil) filter.startDate.$lte = new Date(startUntil as string);
  }

  // Search by radius
  if (lat && lng && radius) {
    filter.geo = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
        },
        $maxDistance: parseFloat(radius as string),
      },
    };
  }

  // Search by text
  if (search && typeof search === "string") {
    filter.$text = { $search: search };
  }

  const pageNum = parseInt(page as string);
  const limitNum = Number(limit) > 100 ? 100 : Number(limit);

  const eventsDb = await Event.find(filter)
    .populate("createdById", "username")
    .populate("locationId")
    .populate("artistsIds")
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .sort({ startDate: 1 })
    .lean();

  // Add eventRelation info for logged in users (favorited, hidden)
  const eventIds = eventsDb.map((e) => e._id);
  let relationMap = new Map<string, string>();
  if (req.user) relationMap = await getEventRelationship(req.user.id, eventIds);

  const events = eventsDb.map((event) => ({
    ...event,
    mainImageUrl: getPublicFileUrl(event.mainImageKey),
    interactionType: relationMap.get(event._id.toString()) || null,
  }));

  res.json(events);
};

export const eventGetOne: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;

  const event = await Event.findById(id)
    .populate("createdById", "username")
    .populate("locationId")
    .populate("artistsIds")
    .lean();

  if (!event)
    throw new Error(`Event with id of ${id} doesn't exist`, {
      cause: { status: 404 },
    });

  const artistsWithUrls = event.artistsIds?.map((artist: any) => ({
    ...artist,
    mainImageUrl: getPublicFileUrl(artist.mainImageKey),
  }));

  // Add eventRelation info for logged in users (favorited, hidden)
  const eventIds = [event._id];
  let relationMap = new Map<string, string>();
  if (req.user) relationMap = await getEventRelationship(req.user.id, eventIds);

  res.json({
    ...event,
    mainImageUrl: getPublicFileUrl(event.mainImageKey),
    artistsIds: artistsWithUrls,
    interactionType: relationMap.get(event._id.toString()) || null,
  });
};

export const eventUpdate: RequestHandler = async (req, res) => {
  /**
   * First we destructure the data we should already have from the loader. The loader should have
   * checked that we do have an artist stored on the request for the id of params. Also the authentication
   * must have stored a user on the request.
   */
  const {
    body: {
      locationId,
      artistsIds,
      title,
      startDate,
      endDate,
      description,
      mainImageKey,
      websiteUrl,
    },
    event,
  } = req;

  assertExists(event);

  // Loctation Update
  if (locationId) {
    const location = await Location.findById(locationId);
    if (!location)
      throw new Error("Location does not exist", { cause: { status: 400 } });

    event.locationId = locationId;
    event.geo = location.geo; // keep geo in sync
    event.locationName = location.name;
  }

  // Artists Update. In here we are getting the genres from selected artists, deduplicating and adding them to the request
  // We do the same for artist names
  if (artistsIds) {
    const artists = await Artist.find({
      _id: { $in: artistsIds },
    }).select("genres name");

    if (artists.length !== artistsIds.length)
      throw new Error("One or more artists do not exist", {
        cause: { status: 400 },
      });

    event.artistsIds = artistsIds;
    event.genres = [...new Set(artists.flatMap((a) => a.genres))];
    event.artistNames = artists.map((a) => a.name);
  }

  // Simple Fields
  if (title !== undefined) event.title = title;
  if (startDate !== undefined) event.startDate = startDate;
  if (endDate !== undefined) event.endDate = endDate;
  if (description !== undefined) event.description = description;
  if (mainImageKey !== undefined) event.mainImageKey = mainImageKey;
  if (websiteUrl !== undefined) event.websiteUrl = websiteUrl;

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
