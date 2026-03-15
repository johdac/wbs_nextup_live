import { Artist, EventRelation, User } from "#models";
import type { RequestHandler } from "express";
import { assertExists, getPublicFileUrl } from "#utils";
import { Types } from "mongoose";

export const eventRelationUpsert: RequestHandler = async (req, res) => {
  const { id: eventId } = req.params;
  const { interactionType } = req.body;

  if (typeof eventId !== "string")
    throw new Error("Invalid eventId", { cause: { status: 400 } });

  assertExists(req.user);
  const userId = req.user.id;
  const relation = await EventRelation.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
    },
    { interactionType },
    { new: true, upsert: true },
  );
  res.json(relation);
};

export const eventRelationDelete: RequestHandler = async (req, res) => {
  const { id: eventId } = req.params;
  assertExists(req.user);
  const userId = req.user.id;

  await EventRelation.deleteOne({
    userId,
    eventId,
  });
  res.json({ success: `Event relation was deleted` });
};
