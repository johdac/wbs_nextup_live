import "#db";
import express from "express";
import { attachUser, errorHandler, requireAuth } from "#middleware";
import { artistRoutes, eventRoutes, locationRoutes } from "#routes";
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

app.use((req, _res, next) => {
  console.log("REQ", req.method, req.path);
  console.log("AUTH", req.headers.authorization);
  next();
});

app.route("/").get((req, res) => {
  res.json("Hello World");
});

// ✅ 用來測試：前端帶 Bearer token 打這支，會自動建立/綁定 DB user
app.post("/me", requireAuth, attachUser, (req, res) => {
  if (!req.userDoc) {
    return res.status(500).json({
      error: "userDoc is missing. attachUser did not run or failed.",
      hasAuth: !!req.auth,
      authSub: (req.auth?.payload as any)?.sub ?? null,
    });
  }
  res.json({
    id: req.userDoc._id,
    username: req.userDoc.username,
    email: req.userDoc.email,
    role: req.userDoc.role,
  });
});

app.get("/public", (req, res) => res.json({ ok: true }));
app.get("/private", requireAuth, attachUser, (req, res) => res.json({ id: req.userDoc._id }));

app.use("/events", requireAuth, attachUser, eventRoutes);
app.use("/artists", artistRoutes);
app.use("/locations", locationRoutes);
app.use("*splat", (req, res) => {
  throw new Error("Not found", { cause: { status: 404 } });
});

app.use(errorHandler);
app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));
