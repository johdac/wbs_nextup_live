import jwt from "jsonwebtoken";

// Call this like so from /api route "node --env-file=.env.development.local src/tools/jsonwebtoken.ts"

const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
if (!ACCESS_JWT_SECRET) {
  console.log("Missing env variable for ACCESS_JWT_SECRET");
} else {
  const token = jwt.sign(
    {
      roles: ["USER"],
    },
    ACCESS_JWT_SECRET,
    {
      subject: "6995d3c12b8e0f0121cef187", // this must be the id of an existing user
      expiresIn: "15m",
    },
  );
  console.log(token);
}
