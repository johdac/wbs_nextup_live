import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "organizer"],
      default: "user",
    },
    favoritedEventsIds: [
      {
        type: Types.ObjectId,
        ref: "Event",
      },
    ],
    excludedEventsIds: [
      {
        type: Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export const User = model("User", userSchema);
