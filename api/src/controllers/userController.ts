import { assertExists } from "#utils";
import type { RequestHandler } from "express";

export const userUpdate: RequestHandler = async (req, res) => {
  /**
   * First we destructure the data we should already have from the loader. The loader should have
   * checked that we do have an artist stored on the request for the id of params. Also the authentication
   * must have stored a user on the request.
   */
  const {
    body: { favoritedEventsIds },
    requestedUser,
  } = req;

  assertExists(requestedUser);
  if (favoritedEventsIds) requestedUser.favoritedEventsIds = favoritedEventsIds;

  await requestedUser.save();
  res.json(requestedUser);
};
