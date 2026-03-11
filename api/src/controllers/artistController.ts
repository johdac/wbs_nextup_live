import { Artist, User } from "#models";
import type { RequestHandler } from "express";
import { assertExists, getPublicFileUrl } from "#utils";
import { Types } from "mongoose";

export const artistCreate: RequestHandler = async (req, res) => {
  // Setting the createdById value of the request to the current user we attached in authenticate
  assertExists(req.user);
  req.body.createdById = req.user.id;

  const artist = await Artist.create(req.body);
  res.json(artist);
};

export const artistGetAll: RequestHandler = async (req, res) => {
  const { createdById, page = "1", limit = 20 } = req.query;

  const filter: any = {};

  // Search by createdById
  if (createdById && typeof createdById === "string") {
    // TODO this should be moved into params validation middleware
    if (!Types.ObjectId.isValid(createdById))
      throw new Error("Invalid createdById", { cause: { status: 400 } });
    filter.createdById = new Types.ObjectId(createdById);
  }

  const pageNum = parseInt(page as string);
  const limitNum = Number(limit) > 100 ? 100 : Number(limit);

  const artistsDb = await Artist.find(filter)
    .populate("createdById", "username")
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .sort({ name: 1 })
    .lean();

  const artists = artistsDb.map((artist) => ({
    ...artist,
    mainImageUrl: getPublicFileUrl(artist.mainImageKey),
  }));

  res.json(artists);
};

export const artistGetOne: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;

  const artist = await Artist.findById(id)
    .populate("createdById", "username")
    .lean();

  if (!artist)
    throw new Error(`Artist with id of ${id} doesn't exist`, {
      cause: { status: 404 },
    });

  res.json({ ...artist, mainImageUrl: getPublicFileUrl(artist.mainImageKey) });
};

export const artistUpdate: RequestHandler = async (req, res) => {
  /**
   * First we destructure the data we should already have from the loader. The loader should have
   * checked that we do have an artist stored on the request for the id of params. Also the authentication
   * must have stored a user on the request.
   */
  const {
    params: { id },
    body: {
      name,
      genres,
      musicResources,
      imageKeys,
      description,
      mainImageKey,
      websiteUrl,
    },
    artist,
  } = req;

  assertExists(artist);
  if (name) artist.name = name;
  if (genres) artist.genres = genres;
  if (musicResources) artist.musicResources = musicResources;
  if (imageKeys) artist.imageKeys = imageKeys;
  if (description) artist.description = description;
  if (mainImageKey) artist.mainImageKey = mainImageKey;
  if (websiteUrl) artist.websiteUrl = websiteUrl;

  await artist.save();
  res.json(artist);
};

export const artistDelete: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;

  await Artist.findByIdAndDelete(id);
  res.json({ success: `Artist with id of ${id} was deleted` });
};
