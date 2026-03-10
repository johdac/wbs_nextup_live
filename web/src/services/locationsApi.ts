import { eventsApi } from "./events.services";

export interface EventCardLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  geo: GeoPoint;
}
export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface Location {
  _id?: string;
  id?: string;
  name: string;
  geo: GeoPoint;
  zip?: string;
  address?: string | any;
  city?: string;
  country?: string;
  description?: string;
  websiteUrl?: string;
  createdById?: {
    _id: string;
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLocationInput {
  name: string;
  geo: GeoPoint;
  zip?: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
  websiteUrl?: string;
}

export type UpdateLocationInput = Partial<CreateLocationInput>;

export const locationsService = {
  getLocations: async (createdById?: string): Promise<Location[]> => {
    const { data } = await eventsApi.get<Location[]>("/locations", {
      params: createdById ? { createdById } : undefined,
    });
    return data;
  },
  getLocationById: async (id: string): Promise<Location> => {
    const { data } = await eventsApi.get<Location>(`/locations/${id}`);
    return data;
  },
  createLocation: async (locationData: CreateLocationInput): Promise<Location> => {
    const { data } = await eventsApi.post<Location>("/locations", locationData);
    return data;
  },
  updateLocation: async (
    id: string,
    locationData: UpdateLocationInput,
  ): Promise<Location> => {
    const { data } = await eventsApi.put<Location>(
      `/locations/${id}`,
      locationData,
    );
    return data;
  },
  deleteLocation: async (id: string): Promise<void> => {
    await eventsApi.delete(`/locations/${id}`);
  },
};
