import type { RequestHandler } from "express";

/**
 * We check if the current user is allowed to perform an action
 * depending on a role. This checks with an OR flow.
 */

export const authorize = (...roles: string[]): RequestHandler => {
  return async (req, _res, next) => {
    // If we did not store a user on the request in authentication handling, bail early
    if (!req.user) throw new Error("Unauthorized", { cause: { status: 401 } });

    const { roles: userRoles, id: userId } = req.user;

    // If the current user is an admin, he may proceed anyway
    if (userRoles.includes("admin")) return next();

    // If we passed "self" as a role we check if the ids matched on the current user + the createdBy id which we extracted in the loader
    if (roles.includes("self")) {
      // Let's make sure we have something to compare against
      if (!req.createdBy)
        throw new Error("No ownership for entry found", {
          cause: { status: 500 },
        });
      if (req.createdBy.equals(userId)) return next();
    }

    // If we passed organizer as a role we check if current user has that role
    if (roles.includes("organizer"))
      if (userRoles.includes("organizer")) return next();

    // If none of the above hit, the user is not allowed to perform the action
    throw new Error("Forbidden", { cause: { status: 403 } });
  };
};
