import { Event } from "#models";
import type { RequestHandler } from "express";

export const eventGetAll: RequestHandler = async (req, res) => {
  const scores = await Event.find().populate("userId", "username");
  res.json(scores);
};

export const eventCreate: RequestHandler = async (req, res) => {
  const data = await Event.create(req.body);
  res.json(data);
};
