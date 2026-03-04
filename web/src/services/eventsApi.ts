import { eventsApi } from "./events.services";

interface EventSearchParams {
  search?: string;
  artistId?: string;
  locationId?: string;
  organizerId?: string;
  genres?: string[]; // will be comma-separated
  lat?: number;
  lng?: number;
  radius?: number;
  startAfter?: string; // ISO date string
  startUntil?: string; // ISO date string
  page?: number;
}

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface UserSummary {
  id: string;
  username: string;
}

export interface Location {
  id: string;
  name: string;
  geo: GeoPoint;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  description: string;
  musicUrls: string[];
  imageUrls: string[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;

  createdById: UserSummary;

  locationId: Location;
  locationName: string;

  artistsIds: Artist[];
  artistNames: string[];

  genres: string[];

  geo: GeoPoint;

  startDate: string;
  endDate: string;

  createdAt: string;
  updatedAt: string;
}
export const eventsService = {
  getEventById: async (id: string): Promise<Event> => {
    const { data } = await eventsApi.get<Event>(`/events/${id}`);
    return data;
  },
  fetchEventsList: async (
    page: number = 1,
    filters?: Omit<EventSearchParams, "page">,
  ): Promise<Event[]> => {
    const params: Record<string, string> = { page: page.toString() };

    if (filters?.search) params.search = filters.search;
    if (filters?.artistId) params.artistId = filters.artistId;
    if (filters?.locationId) params.locationId = filters.locationId;
    if (filters?.organizerId) params.organizerId = filters.organizerId;
    if (filters?.genres?.length) params.genres = filters.genres.join(",");
    if (filters?.lat !== undefined) params.lat = filters.lat.toString();
    if (filters?.lng !== undefined) params.lng = filters.lng.toString();
    if (filters?.radius !== undefined)
      params.radius = filters.radius.toString();
    if (filters?.startAfter) params.startAfter = filters.startAfter;
    if (filters?.startUntil) params.startUntil = filters.startUntil;

    const { data } = await eventsApi.get<Event[]>("/events", { params });
    return data;
  },
};
