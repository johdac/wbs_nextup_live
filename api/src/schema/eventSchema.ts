import z from "zod";
import { dateString, mongoId, string128 } from "./rules.ts";

export const eventSchema = z.strictObject({
  location: mongoId,
  artists: z.array(mongoId),
  title: string128,
  startDate: dateString,
  endDate: dateString,
  description: z.string().optional(),
});

export const eventUpdateSchema = eventSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
