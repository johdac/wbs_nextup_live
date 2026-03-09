import { eventsApi } from "./events.services";

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
  address?: string;
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

export const locationsService = {
  getLocations: async (): Promise<Location[]> => {
    const { data } = await eventsApi.get<Location[]>("/locations");
    return data;
  },
  getLocationById: async (id: string): Promise<Location> => {
    const { data } = await eventsApi.get<Location>(`/locations/${id}`);
    return data;
  },
  createLocation: async (
    locationData: CreateLocationInput,
  ): Promise<Location> => {
    const { data } = await eventsApi.post<Location>("/locations", locationData);
    return data;
  },
};
