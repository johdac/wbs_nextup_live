import mongoose from "mongoose";
import { resCleanup } from "./plugins/resCleanup.plugins.ts";
import dns from "node:dns/promises"; // for connection on mobile

mongoose.plugin(resCleanup);

try {
  if (!process.env.MONGO_URI) throw new Error("Missing MONGO_URI");
  dns.setServers(["1.1.1.1", "8.8.8.8"]); // for connection on mobile
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
  });
  console.log("\x1b[35mMongoDB connected via Mongoose\x1b[0m");
} catch (err) {
  console.error(err);
}
