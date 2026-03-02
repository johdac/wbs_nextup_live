import { auth } from "express-oauth2-jwt-bearer";

export const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE, // API Identifier
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});
