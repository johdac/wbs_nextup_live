import z from "zod";
import { mongoId, string128 } from "./rules.ts";
import { GENRES } from "#shared";

export const artistSchema = z.object({
  createdBy: mongoId,
  name: string128,
  genres: z.array(z.enum(GENRES).optional()),
  description: z.string().optional(),
  musicUrls: z.array(z.url({ message: "Invalid url format" })).optional(),
  mainImageUrl: z.url({ message: "Invalid url format" }).optional(),
  imageUrls: z.array(z.url({ message: "Invalid url format" })).optional(),
  websiteUrl: z.url({ message: "Invalid url format" }).optional(),
});

export const artistUpdateSchema = artistSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
