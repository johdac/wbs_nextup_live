export type LocationSearchResult = {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
};

export type NominatimSearchItem = {
  name?: string;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    pedestrian?: string;
    footway?: string;
    house_number?: string;
    building?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    postcode?: string;
    country?: string;
  };
};

export type EventFormValues = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  selectedLocationId: string;
  selectedArtistIds: string[];
  isCreatingNewLocation: boolean;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  locationZip: string;
  locationCountry: string;
  locationLat: string;
  locationLng: string;
  isCreatingNewArtist: boolean;
  artistName: string;
  artistGenres: string[];
  artistDescription: string;
  artistWebsiteUrl: string;
  artistMusicUrls: {
    title: string;
    url: string;
  }[];
};
