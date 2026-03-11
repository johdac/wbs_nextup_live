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
  mainImageKey?: string;
  imageUrls?: string[];
  websiteUrl?: string;
}

export interface ArtistSearchParams {
  search?: string;
  genres?: string[];
  page?: number;
  createdById?: number;
}

export interface EventCardArtist {
  id: string;
  name: string;
  genre: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
}

const transformArtist = (artist: Artist): EventCardArtist => {
  return {
    id: artist.id || artist._id || "",
    name: artist.name || "",
    genre: artist.genres?.[0] || "Unknown",
    description: artist.description || "",
    imageUrl: "/placeholder.svg",
    websiteUrl: artist.websiteUrl || "",
  };
};

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
  fetchArtistsList: async (
    page: number = 1,
    filters?: Omit<ArtistSearchParams, "page">,
  ): Promise<EventCardArtist[]> => {
    const params: Record<string, string> = { page: page.toString() };

    if (filters?.search) params.search = filters.search;
    if (filters?.genres?.length) params.genres = filters.genres.join(",");

    const { data } = await eventsApi.get<Artist[]>("/artists", { params });
    return data.map((artist) => transformArtist(artist));
  },
  deleteArtist: async (id: string): Promise<void> => {
    await eventsApi.delete(`/artists/${id}`);
  },
};
