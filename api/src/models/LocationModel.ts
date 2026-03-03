import { model, Schema, Types } from "mongoose";

const locationSchema = new Schema(
  {
    createdById: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "A userId is required"],
    },
    name: { type: String, required: [true, "A name is required"] },
    geo: {
      // GEO Json
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat] in that order!
        required: true,
      },
    },
    zip: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    description: { type: String },
    websiteUrl: { type: String },
  },
  { timestamps: true },
);
locationSchema.index({ geo: "2dsphere" });

export const Location = model("Location", locationSchema);
