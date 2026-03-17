import { Location } from "#models";
import { assertExists } from "#utils";
import type { RequestHandler } from "express";
import { Types } from "mongoose";

export const locationCreate: RequestHandler = async (req, res) => {
  // Setting the createdById value of the request to the current user we attached in authenticate
  assertExists(req.user);
  req.body.createdById = req.user.id;

  const location = await Location.create(req.body);
  res.json(location);
};

export const locationGetAll: RequestHandler = async (req, res) => {
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

  const locationsDb = await Location.find(filter)
    .populate("createdById", "username")
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum + 1) // go one beyond needed to see if there is more
    .sort({ name: 1 });

  // For pagination we check if the returned db response has one item more then we need
  const hasNextPage = locationsDb.length > limitNum;
  const locationsPaginated = hasNextPage
    ? locationsDb.slice(0, limitNum)
    : locationsDb;

  res.json({
    locationsPaginated,
    page,
    hasNextPage,
  });
};

export const locationGetOne: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const location = await Location.findById(id).populate(
    "createdById",
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
    body: { name, geo, zip, address, city, country, description, websiteUrl },
    location,
  } = req;

  assertExists(location);
  if (name) location.name = name;
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
