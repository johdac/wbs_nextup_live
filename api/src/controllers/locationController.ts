import { Location, User } from "#models";
import { assertExists } from "#utils";
import type { RequestHandler } from "express";

export const locationCreate: RequestHandler = async (req, res) => {
  // Setting the createdBy value of the request to the current user we attached in authenticate
  assertExists(req.user);
  req.body.createdBy = req.user.id;

  const location = await Location.create(req.body);
  res.json(location);
};

export const locationGetAll: RequestHandler = async (req, res) => {
  const locations = await Location.find().populate("createdBy", "username");
  res.json(locations);
};

export const locationGetOne: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const location = await Location.findById(id).populate(
    "createdBy",
    "username",
  );
  if (!location)
    throw new Error(`Location with id of ${id} doesn't exist`, {
      cause: { status: 404 },
    });
  res.json(location);
};

export const locationUpdate: RequestHandler = async (req, res) => {
  /**
   * First we destructure the data we should already have from the loader. The loader should have
   * checked that we do have an artist stored on the request for the id of params. Also the authentication
   * must have stored a user on the request.
   */
  const {
    body: { title, geo, zip, address, city, country, description, websiteUrl },
    location,
  } = req;

  assertExists(location);
  if (title) location.title = title;
  if (geo) location.geo = geo;
  if (zip) location.zip = zip;
  if (address) location.address = address;
  if (city) location.city = city;
  if (country) location.country = country;
  if (description) location.description = description;
  if (websiteUrl) location.websiteUrl = websiteUrl;

  await location.save();
  res.json(location);
};

export const locationDelete: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;

  await Location.findByIdAndDelete(id);
  res.json({ success: `Location with id of ${id} was deleted` });
};
