import z from "zod";
import { mongoId } from "./rules";

const GenreEnum = z.enum(["rock", "jazz", "hiphop", "electronic", "classical"]);

type Genre = z.infer<typeof GenreEnum>;

export const artistSchema = z.object({
  createdBy: mongoId,
  name: z.string({ message: "An artists name is required" }),
  genre: GenreEnum.optional(),
  description: z.string().optional(),
  musicUrls: z.array(z.url({ message: "Invalid url format" })).optional(),
  mainImageUrl: z.url({ message: "Invalid url format" }).optional(),
  imageUrls: z.array(z.url({ message: "Invalid url format" })).optional(),
  websiteUrl: z.url({ message: "Invalid url format" }).optional(),
});
