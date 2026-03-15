import { eventsApi } from "./events.services";

export interface User {
  id: string;
  name: string;
  favoritedEventsIds: string[];
  excludedEventsIds: string[];
}

export const userService = {
  getMe: async (): Promise<User> => {
    const { data } = await eventsApi.get<User>(`/users/me`);
    return data;
  },

  updateUser: async (
    id: string,
    favoritedEventsIds: string[],
  ): Promise<User> => {
    const { data } = await eventsApi.put<User>(`/users/${id}`, {
      favoritedEventsIds,
    });
    return data;
  },
};
