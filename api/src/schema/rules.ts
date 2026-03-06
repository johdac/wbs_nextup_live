import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const string64 = z
  .string()
  .min(2, { message: "String must have at least two characters" })
  .max(64, { message: "String may only have up to 64 characters" });

export const string128 = z
  .string()
  .min(2, { message: "String must have at least two characters" })
  .max(128, { message: "String may only have up to 128 characters" });

export const string256 = z
  .string()
  .min(2, { message: "String must have at least two characters" })
  .max(256, { message: "String may only have up to 256 characters" });

export const email = z.email({ message: "Email has wrong format" });

export const password = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password must not exceed 128 characters" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
    message: "Password must contain at least one special character",
  });

export const mongoId = z.string().refine(isValidObjectId, {
  message: "Provided id is not valid",
});

export const geoPoint = z.object({
  type: z.literal("Point", {
    message: "String literal must be 'Point'",
  }),
  coordinates: z.tuple([z.number(), z.number()], {
    message: "Must provide a tuple of two numbers for lng and lat",
  }),
});

export const dateString = z.coerce.date({
  message: "A start date is required",
});

export const url = z.url({ message: "Invalid url format" });
