import type { Schema } from "mongoose";

const cleanTransform = (_: unknown, ret: any) => {
  ret.id = ret._id?.toString();
  delete ret._id;
  delete ret.__v;
};

export function resCleanup(schema: Schema) {
  schema.set("toJSON", { transform: cleanTransform });
  schema.set("toObject", { transform: cleanTransform });
}
