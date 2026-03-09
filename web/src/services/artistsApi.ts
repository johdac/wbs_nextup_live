import { eventsApi } from "./events.services";

export interface Artist {
  _id?: string;
  id?: string;
  name: string;
  genres: string[];
  description?: string;
  musicResources?: {
    url: string;
    title: string;
  }[];
  mainImageUrl?: string;
  imageUrls?: string[];
  websiteUrl?: string;
  createdById?: {
    _id: string;
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateArtistInput {
  name: string;
  genres: string[];
  description?: string;
  musicResources?: {
    url: string;
    title: string;
  }[];
  mainImageUrl?: string;
  imageUrls?: string[];
  websiteUrl?: string;
}

export const artistsService = {
  getArtists: async (): Promise<Artist[]> => {
    const { data } = await eventsApi.get<Artist[]>("/artists");
    return data;
  },
  getArtistById: async (id: string): Promise<Artist> => {
    const { data } = await eventsApi.get<Artist>(`/artists/${id}`);
    return data;
  },
  createArtist: async (artistData: CreateArtistInput): Promise<Artist> => {
    const { data } = await eventsApi.post<Artist>("/artists", artistData);
    return data;
  },
};
