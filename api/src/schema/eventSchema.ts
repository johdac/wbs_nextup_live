import z from "zod";
import { mongoId, string128 } from "./rules.ts";

export const eventSchema = z.object({
  createdBy: mongoId,
  location: mongoId,
  artists: z.array(mongoId),
  title: string128,
  startDate: z.date({ message: "A start date is required" }),
  endDate: z.date({ message: "An end date is required" }),
  description: z.string({ message: "An description is required" }),
});
