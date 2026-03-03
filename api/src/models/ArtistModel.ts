import { model, Schema, Types } from "mongoose";
import { GENRES } from "#shared";

const artistSchema = new Schema(
  {
    createdById: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "A userId is required"],
    },
    name: { type: String, required: [true, "An artists name is required"] },
    genres: [
      {
        type: String,
        enum: GENRES,
        required: true,
      },
    ],
    description: { type: String },
    musicUrls: [{ type: String }],
    mainImageUrl: { type: String },
    imageUrls: [{ type: String }],
    websiteUrl: { type: String },
  },
  { timestamps: true },
);

export const Artist = model("Artist", artistSchema);
