import { eventsApi } from "./events.services";

export const eventsService = {
  getEvents: async () => {
    const { data } = await eventsApi.get("/events");
    return data;
  },
};
