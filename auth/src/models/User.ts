import { Schema, model, Types } from "mongoose";

type UserRole = "user" | "admin" | "organizer";

export interface IUser {
  username: string;
  password: string;
  email: string;
  role: UserRole;
  favoritedEventsIds: Types.ObjectId[];
  excludedEventsIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
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

const User = model<IUser>("User", userSchema);
export default User;
