import { User } from "#models";
import { assertExists } from "#utils";
import type { RequestHandler } from "express";

export const userGetMe: RequestHandler = async (req, res) => {
  assertExists(req.user);
  const me = await User.findById(req.user.id)
    .select("username favoritedEventsIds")
    .lean();
  if (!me)
    throw new Error(`User with id of ${req.user.id} doesn't exist`, {
      cause: { status: 404 },
    });
  res.json(me);
};

export const userUpdateMe: RequestHandler = async (req, res) => {
  const {
    body: { favoritedEventsIds },
  } = req;
  assertExists(req.user);

  // Need to get the current clean again
  const me = await User.findById(req.user.id);
  if (!me)
    throw new Error(`User with id of ${req.user.id} doesn't exist`, {
      cause: { status: 404 },
    });

  if (favoritedEventsIds) me.favoritedEventsIds = favoritedEventsIds;
  await me.save();

  res.json(me);
};

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
