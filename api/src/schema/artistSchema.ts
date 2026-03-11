import z from "zod";
import { string128, url } from "./rules.ts";
import { GENRES } from "#shared";

export const artistSchema = z.strictObject({
  name: string128,
  genres: z.array(z.enum(GENRES).optional()),
  description: z.string().optional(),
  musicUrls: z.array(url).optional(),
  mainImageKey: string128.optional(),
  imageKeys: z.array(string128).optional(),
  websiteUrl: url.optional(),
  musicResources: z
    .array(
      z.object({
        url: url,
        title: z
          .string()
          .max(128, { message: "String may only have up to 128 characters" }),
      }),
    )
    .optional(),
});

export const artistUpdateSchema = artistSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
