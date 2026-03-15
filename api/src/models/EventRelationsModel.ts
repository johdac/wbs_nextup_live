import { model, Schema, Types } from "mongoose";

const EventRelationsSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Types.ObjectId,
      ref: "Event",
      required: true,
    },
    interactionType: {
      type: String,
      enum: ["favorite", "hidden"],
      required: true,
    },
  },
  { timestamps: true },
);
EventRelationsSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export const EventRelation = model("EventRelation", EventRelationsSchema);
