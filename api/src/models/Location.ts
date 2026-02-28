import { model, Schema, Types } from "mongoose";

const locationSchema = new Schema(
  {
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "A userId is required"],
    },
    title: { type: String, required: [true, "A title is required"] },
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
  },
  { timestamps: true },
);

export const Location = model("Location", locationSchema);
