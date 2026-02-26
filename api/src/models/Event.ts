import { model, Schema, Types } from "mongoose";

const eventSchema = new Schema(
  {
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "A userId is required"],
    },
    location: {
      type: Types.ObjectId,
      ref: "Location",
      required: [true, "A location is required"],
    },
    artists: [
      {
        type: Types.ObjectId,
        ref: "Artist",
      },
    ],
    title: { type: String, required: [true, "A title is required"] },
    startDate: { type: Date, required: [true, "A start date is required"] },
    endDate: { type: Date, required: [true, "An end date is required"] },
    description: { type: String },
  },
  { timestamps: true },
);
eventSchema.index({ location: 1 });
eventSchema.index({ artists: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ createdBy: 1 });

export const Event = model("Event", eventSchema);
