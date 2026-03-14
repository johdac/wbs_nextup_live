import { eventsApi } from "./events.services";

export interface Artist {
  _id?: string;
  id?: string;
  name: string;
  genres: string[];
  description?: string;
  musicResources?: {
    _id: string;
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
  mainImageKey?: string;
  imageUrls?: string[];
  websiteUrl?: string;
}

export type UpdateArtistInput = Partial<CreateArtistInput>;

export interface ArtistSearchParams {
  search?: string;
  genres?: string[];
  page?: number;
  createdById?: string;
}

export interface EventCardArtist {
  id: string;
  name: string;
  genre: string;
  description: string;
  mainImageUrl: string;
  websiteUrl: string;
}

export const artistsService = {
  getArtists: async (createdById?: string): Promise<Artist[]> => {
    const { data } = await eventsApi.get<Artist[]>("/artists", {
      params: createdById ? { createdById } : undefined,
    });
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
  updateArtist: async (
    id: string,
    artistData: Partial<UpdateArtistInput>,
  ): Promise<Artist> => {
    const { data } = await eventsApi.put<Artist>(`/artists/${id}`, artistData);
    return data;
  },
  deleteArtist: async (id: string): Promise<void> => {
    await eventsApi.delete(`/artists/${id}`);
  },
};
