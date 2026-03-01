import z from "zod";
import { mongoId } from "./rules.ts";

export const idParamSchema = z.strictObject({
  id: mongoId,
});
