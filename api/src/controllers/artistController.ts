import { Artist } from "#models";
import type { RequestHandler } from "express";

export const artistCreate: RequestHandler = async (req, res) => {
  const artist = await Artist.create(req.body);
  res.json(artist);
};

export const artistGetAll: RequestHandler = async (req, res) => {
  const artists = await Artist.find().populate("createdBy", "username");
  res.json(artists);
};

export const artistGetOne: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const artist = await Artist.findById(id).populate("createdBy", "username");
  if (!artist)
    throw new Error(`Artist with id of ${id} doesn't exist`, { cause: 404 });
  res.json(artist);
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
      genre,
      musicUrls,
      imageUrls,
      description,
      mainImageUrl,
      websiteUrl,
    },
    artist,
  } = req;

  if (!artist)
    throw new Error(`Artist with id of ${id} doesn't exist`, { cause: 404 }); // Just for TS
  if (name) artist.name = name;
  if (genre) artist.genre = genre;
  if (musicUrls) artist.musicUrls = musicUrls;
  if (imageUrls) artist.imageUrls = imageUrls;
  if (description) artist.description = description;
  if (mainImageUrl) artist.mainImageUrl = mainImageUrl;
  if (websiteUrl) artist.websiteUrl = websiteUrl;

  await artist.save();
  res.json(artist);
};

export const artistDelete: RequestHandler = async (req, res) => {
  const {
    params: { id },
    artist,
  } = req;

  if (!artist)
    throw new Error(`Post with id of ${id} doesn't exist`, { cause: 404 });
  await Artist.findByIdAndDelete(id);
  res.json({ success: `Artist with id of ${id} was deleted` });
};
