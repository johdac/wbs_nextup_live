import z from "zod";
import { mongoId } from "./rules.ts";

export const eventRelationSchema = z.strictObject({
  interactionType: z.enum(["favorite", "hidden"]),
});
