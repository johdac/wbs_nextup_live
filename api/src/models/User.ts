import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    auth0Id: {
      type: String,
      unique: true,
      sparse: true, // allow the old accounts without auth0Id
      index: true,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    password: {
      type: String,
      // required: [true, "Password is required"], // don't require password, let Auth0 users without password
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
    favoritedEvents: [
      {
        type: Types.ObjectId,
        ref: "Event",
      },
    ],
    excludedEvents: [
      {
        type: Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export const User = model("User", userSchema);
