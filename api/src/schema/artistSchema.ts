import z from "zod";
import { mongoId, string128 } from "./rules.ts";

const GenreEnum = z.enum(["rock", "jazz", "hiphop", "electronic", "classical"]);

type Genre = z.infer<typeof GenreEnum>;

export const artistSchema = z.object({
  createdBy: mongoId,
  name: string128,
  genre: GenreEnum.optional(),
  description: z.string().optional(),
  musicUrls: z.array(z.url({ message: "Invalid url format" })).optional(),
  mainImageUrl: z.url({ message: "Invalid url format" }).optional(),
  imageUrls: z.array(z.url({ message: "Invalid url format" })).optional(),
  websiteUrl: z.url({ message: "Invalid url format" }).optional(),
});
