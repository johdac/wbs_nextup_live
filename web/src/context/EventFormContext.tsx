import { createContext, useContext } from "react";
import L from "leaflet";

export interface ArtistOption {
  _id?: string;
  id?: string;
  name: string;
  genres: string[];
  description?: string;
  websiteUrl?: string;
  mainImageUrl?: string;
  imageUrls?: string[];
  musicResources?: {
    url: string;
    title: string;
  }[];
  createdById?: {
    _id: string;
    username: string;
  };
}

export interface LocationOption {
  id?: string;
  _id?: string;
  name: string;
  city?: string;
  address?: string;
  country?: string;
  zip?: string;
  geo: { coordinates: [number, number] };
}

export interface LocationSearchResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
}

export interface SavedArtistPreview {
  name: string;
  mainImageUrl?: string;
  description?: string;
  websiteUrl?: string;
  genres: string[];
  musicResources: {
    title: string;
    url: string;
  }[];
}

export interface EventFormContextValue {
  isCreatingNewLocation: boolean;
  selectedLocationId: string;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  locationZip: string;
  locationCountry: string;
  locationLat: string;
  locationLng: string;
  isGeocodingLocation: boolean;
  locationsLoading: boolean;
  createLocationMutationIsPending: boolean;
  locations: LocationOption[];
  selectedLocation?: LocationOption;
  searchInput: string;
  searchResults: LocationSearchResult[];
  isSearching: boolean;
  showSearchResults: boolean;
  onToggleCreateNewLocation: () => void;
  onToggleSelectExistingLocation: () => void;
  onLocationSelect: (locationId: string) => void;
  onLocationNameChange: (value: string) => void;
  onLocationAddressChange: (value: string) => void;
  onLocationCityChange: (value: string) => void;
  onLocationZipChange: (value: string) => void;
  onLocationCountryChange: (value: string) => void;
  onCreateLocation: () => void;
  onMapClick: (e: L.LeafletMouseEvent) => void;
  onLocationSearch: (query: string) => void;
  onSelectSearchResult: (result: LocationSearchResult) => void;

  isCreatingNewArtist: boolean;
  selectedArtistIds: string[];
  artistName: string;
  artistGenres: string[];
  artistDescription: string;
  artistWebsiteUrl: string;
  artistMusicUrls: {
    title: string;
    url: string;
  }[];
  artistMainImagePreviewUrl?: string;
  artistsLoading: boolean;
  createArtistMutationIsPending: boolean;
  artists: ArtistOption[];
  onToggleCreateNewArtist: () => void;
  onToggleSelectExistingArtist: () => void;
  onArtistSelect: (artistId: string) => void;
  onArtistNameChange: (value: string) => void;
  onArtistGenreToggle: (genre: string) => void;
  onArtistDescriptionChange: (value: string) => void;
  onArtistWebsiteUrlChange: (value: string) => void;
  onArtistMusicUrlChange: (
    index: number,
    field: "title" | "url",
    value: string,
  ) => void;
  onAddArtistMusicUrl: () => void;
  onRemoveArtistMusicUrl: (index: number) => void;
  onArtistMainImageFileChange: (file: File | null) => void;
  showSavedArtistPreview: boolean;
  savedArtistPreviewId: string | null;
  savedArtistPreview: SavedArtistPreview | null;
  onEditSavedArtist: () => void;
  onLoadArtistForEdit: (artistId: string) => void;
  onCreateArtist: () => void | Promise<void>;
}

export const EventFormContext = createContext<
  EventFormContextValue | undefined
>(undefined);

export const useEventFormContext = () => {
  const context = useContext(EventFormContext);
  if (!context) {
    throw new Error(
      "useEventFormContext must be used within EventFormProvider",
    );
  }
  return context;
};
