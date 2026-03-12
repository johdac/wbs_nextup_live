import { eventsApi } from "./events.services";

interface MusicResource {
  url: string;
  title: string;
  id: string;
}

export interface EventCardArtist {
  id: string;
  name: string;
  genre: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  musicResources?: MusicResource[];
}

export interface EventCardLocation {
  id: string;
  name: string;
  address: string;
  city: string;
}

export interface EventListItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: EventCardLocation;
  artists: EventCardArtist[];
  genre: string;
  coverImage: string;
  isPopular: boolean;
  organizerName: string;
}

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
  limit?: number;
}

export interface CreateEventInput {
  locationId: string;
  artistsIds: string[];
  title: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  description?: string;
  mainImageKey?: string;
}

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}

interface ApiUserSummary {
  _id?: string;
  id?: string;
  username: string;
}

interface ApiLocation {
  _id?: string;
  id?: string;
  name: string;
  city?: string;
  address?: string;
}

interface ApiArtist {
  _id?: string;
  id?: string;
  name: string;
  genres: string[];
  description?: string;
  imageUrl: string;
  websiteUrl: string;
  musicResources?: MusicResource[];
}

interface ApiEvent {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  mainImageUrl?: string;

  createdById: ApiUserSummary | string;

  locationId: ApiLocation | string;
  locationName: string;

  artistsIds: ApiArtist[];
  artistNames: string[];

  genres: string[];

  geo: GeoPoint;

  startDate: string;
  endDate: string;

  createdAt: string;
  updatedAt: string;
}

// Transform API response to MusicEvent format for display
const transformEventToMusicEvent = (event: ApiEvent): EventListItem => {
  const organizer =
    typeof event.createdById === "object" ? event.createdById : undefined;
  const location =
    typeof event.locationId === "object" ? event.locationId : undefined;

  return {
    id: event.id || (event._id as string),
    title: event.title,
    description: event.description || "",
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      id: location?.id || location?._id || "",
      name: event.locationName || location?.name || "Unknown Location",
      address: location?.address || "",
      city: location?.city || "",
    },
    artists:
      event.artistsIds?.map((artist) => {
        return {
          id: artist.id || artist._id || "",
          name: artist.name || "",
          genre: artist.genres?.[0] || "Unknown",
          description: artist.description || "",
          imageUrl: "/placeholder.svg",
          websiteUrl: artist.websiteUrl || "",
          musicResources: artist.musicResources,
        };
      }) || [],
    genre: event.genres?.[0] || "Unknown",
    coverImage: event.mainImageUrl || "/placeholder.jpeg",
    isPopular: false,
    organizerName: organizer?.username || "Unknown Organizer",
  };
};

export const eventsService = {
  getEventById: async (id: string): Promise<EventListItem> => {
    const { data } = await eventsApi.get<ApiEvent>(`/events/${id}`);
    return transformEventToMusicEvent(data);
  },
  fetchEventsList: async (
    page: number = 1,
    filters?: Omit<EventSearchParams, "page">,
  ): Promise<EventListItem[]> => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: (filters?.limit ?? 20).toString(),
    };

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

    const { data } = await eventsApi.get<ApiEvent[]>("/events", { params });
    return data.map((event) => transformEventToMusicEvent(event));
  },

  createEvent: async (eventData: CreateEventInput): Promise<EventListItem> => {
    const { data } = await eventsApi.post<ApiEvent>("/events", eventData);
    return transformEventToMusicEvent(data);
  },

  updateEvent: async (
    id: string,
    payload: {
      title: string;
      description: string;
      locationId: string;
      artistsIds: string[];
      startDate: string;
      endDate: string;
    },
  ) => {
    const { data } = await eventsApi.put<CreateEventInput>(
      `/events/${id}`,
      payload,
    );
    return data;
  },
};
