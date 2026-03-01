import jwt from "jsonwebtoken";

// Call this like so from within the /api folder "node --env-file=.env.development.local src/tools/createWebtoken.ts"

const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
if (!ACCESS_JWT_SECRET) {
  console.log("Missing env variable for ACCESS_JWT_SECRET");
} else {
  const token = jwt.sign(
    {
      roles: ["organizer"],
    },
    ACCESS_JWT_SECRET,
    {
      subject: "69a3051fae0d074d723d0da2", // this must be the id of an existing user
      expiresIn: "55d",
    },
  );
  console.log(token);
}
