import "#db";
import express from "express";
import { errorHandler } from "#middleware";
import {
  artistRoutes,
  eventRelationRoutes,
  eventRoutes,
  locationRoutes,
  uploadRoutes,
  userRoutes,
} from "#routes";
import cors from "cors";

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: process.env.WEB_URL,
    credentials: true,
    exposedHeaders: ["WWW-Authenticate"],
  }),
);
app.use(express.json());

app.route("/").get((req, res) => {
  res.json("Hello World");
});
app.use("/events", eventRoutes);
app.use("/artists", artistRoutes);
app.use("/locations", locationRoutes);
app.use("/upload", uploadRoutes);
app.use("/users", userRoutes);
app.use("/eventrelations/", eventRelationRoutes);
app.use("*splat", (req, res) => {
  throw new Error("Not found", { cause: { status: 404 } });
});

app.use(errorHandler);
app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`),
);
