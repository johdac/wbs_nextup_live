import z from "zod";
import { geoPoint, mongoId, string128, string256, string64 } from "./rules.ts";

export const locationSchema = z.object({
  createdBy: mongoId,
  title: string128,
  geo: geoPoint,
  zip: string64.optional(),
  address: string128.optional(),
  city: string64.optional(),
  country: string64.optional(),
  description: z.string().optional(),
});

export const loactionUpdateSchema = locationSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
