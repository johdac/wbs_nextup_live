import mongoose from "mongoose";
import { resCleanup } from "./plugins/resCleanup.plugins.ts";

mongoose.plugin(resCleanup);

try {
  if (!process.env.MONGO_URI) throw new Error("Missing MONGO_URI");
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
  });
  console.log("\x1b[35mMongoDB connected via Mongoose\x1b[0m");
} catch (err) {
  console.error(err);
}
