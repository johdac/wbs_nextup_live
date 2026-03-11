import { model, Schema, Types } from "mongoose";
import { GENRES } from "#shared";

const eventSchema = new Schema(
  {
    createdById: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "A userId is required"],
    },
    locationId: {
      type: Types.ObjectId,
      ref: "Location",
      required: [true, "A location is required"],
    },
    // This will store the location name to be able to search for events with location X
    locationName: { type: String },
    artistsIds: [
      {
        type: Types.ObjectId,
        ref: "Artist",
      },
    ],
    // This will store the artist names for all artists to be able to search for events with artist X
    artistNames: [{ type: String }],
    // This will store a copy of all genres from all attending artists
    genres: [
      {
        type: String,
        enum: GENRES,
        required: true,
      },
    ],
    // This will store a copy of location geo for faster search
    geo: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    title: { type: String, required: [true, "A title is required"] },
    startDate: { type: Date, required: [true, "A start date is required"] },
    endDate: { type: Date, required: [true, "An end date is required"] },
    description: { type: String },
    mainImageKey: { type: String },
  },
  { timestamps: true },
);
eventSchema.index({ locationId: 1 });
eventSchema.index({ artistsIds: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ createdById: 1 });
eventSchema.index({ genres: 1 });
eventSchema.index({
  title: "text",
  description: "text",
  artistNames: "text",
  locationName: "text",
});
eventSchema.index({ geo: "2dsphere" });

export const Event = model("Event", eventSchema);
