import type { Event, Artist, Location, User } from "#models";

declare global {
  namespace Express {
    interface Request {
      createdById?: Types.ObjectId;
      user?: {
        // data comes from JWT token
        id: Types.ObjectId;
        roles: string[];
      };
      event?: InstanceType<typeof Event>;
      artist?: InstanceType<typeof Artist>;
      location?: InstanceType<typeof Location>;
      requestedUser?: InstanceType<typeof User>;
    }
  }
}
