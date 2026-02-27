import z from "zod";
import { mongoId } from "./rules";

export const idParamSchema = z.object({
  id: mongoId,
});
