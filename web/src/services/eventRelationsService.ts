import { eventsApi } from "./events.services";

export type EventRelation = {
  eventId: string;
  userId: string;
  createdAt: string;
  interactionType: "favorite" | "hidden";
  updatedAt: string;
  id: string;
};

export type EventRelationInput = {
  interactionType: "favorite" | "hidden";
};

export const eventRelationService = {
  upsertEventRelation: async (
    id: string,
    eventRelationData: EventRelationInput,
  ): Promise<EventRelation> => {
    const { data } = await eventsApi.put<EventRelation>(
      `/eventrelations/${id}`,
      eventRelationData,
    );
    return data;
  },

  deleteEventRelation: async (id: string): Promise<void> => {
    await eventsApi.delete(`/eventrelations/${id}`);
  },
};
