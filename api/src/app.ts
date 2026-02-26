import "#db";
import express from "express";
import { errorHandler } from "#middleware";
import { scoreRoutes, aiRoutes } from "#routes";
import cors from "cors";

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
    exposedHeaders: ["WWW-Authenticate"],
  }),
);
app.use(express.json());

app.route("/").get((req, res) => {
  res.json("Hello World");
});
app.use("/ai", aiRoutes);
app.use("/scores", scoreRoutes);
app.use("*splat", (req, res) => {
  throw new Error("Not found", { cause: { status: 404 } });
});

app.use(errorHandler);
app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`),
);
