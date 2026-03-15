import z from "zod";
import { mongoId } from "./rules.ts";

/**
 * We only handle user updates in relation to meta data like favorites, but not for core data
 * such as username, email, password etc. That is handled by the auth server.
 */

export const userUpdateSchema = z
  .strictObject({
    favoritedEventsIds: z.array(mongoId),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
