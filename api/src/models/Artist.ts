import { model, Schema, Types } from "mongoose";

const artistSchema = new Schema(
  {
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "A userId is required"],
    },
    name: { type: String, required: [true, "An artists name is required"] },
    genre: {
      type: String,
      enum: ["rock", "jazz", "hiphop", "electronic", "classical"],
      required: true,
    },
    description: { type: String },
    musicUrls: [{ type: String }],
    mainImageUrl: { type: String },
    imageUrls: [{ type: String }],
    websiteUrl: { type: String },
  },
  { timestamps: true },
);

export const Artist = model("Artist", artistSchema);
