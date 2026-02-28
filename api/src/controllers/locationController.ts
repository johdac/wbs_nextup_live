import { Location, User } from "#models";
import type { RequestHandler } from "express";

export const locationCreate: RequestHandler = async (req, res) => {
  // Check required references
  const { createdBy } = req.body;
  const [userExists] = await Promise.all([User.exists({ _id: createdBy })]);
  if (!userExists)
    throw new Error("CreatedBy user does not exist", {
      cause: { status: 400 },
    });

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
    throw new Error(`Location with id of ${id} doesn't exist`, { cause: 404 });
  res.json(location);
};

export const locationUpdate: RequestHandler = async (req, res) => {
  /**
   * First we destructure the data we should already have from the loader. The loader should have
   * checked that we do have an artist stored on the request for the id of params. Also the authentication
   * must have stored a user on the request.
   */
  const {
    params: { id },
    body: { title, geo, zip, address, city, country, description },
    location,
  } = req;

  if (!location)
    throw new Error(`Location with id of ${id} doesn't exist`, { cause: 404 }); // Just for TS
  if (title) location.title = title;
  if (geo) location.geo = geo;
  if (zip) location.zip = zip;
  if (address) location.address = address;
  if (city) location.city = city;
  if (country) location.country = country;
  if (description) location.description = description;

  await location.save();
  res.json(location);
};

export const locationDelete: RequestHandler = async (req, res) => {
  const {
    params: { id },
    location,
  } = req;

  if (!location)
    throw new Error(`Location with id of ${id} doesn't exist`, { cause: 404 });
  await Location.findByIdAndDelete(id);
  res.json({ success: `Location with id of ${id} was deleted` });
};
