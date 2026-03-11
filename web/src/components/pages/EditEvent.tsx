import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { CalendarIcon, Save, AlertCircle, Trash2 } from "lucide-react";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { artistsService } from "../../services/artistsApi";
import { locationsService } from "../../services/locationsApi";
import { DateTimeRangePicker } from "../ui/date-time-picker";
import { LocationLayout } from "../layout/LocationLayout";
import { ArtistLayout } from "../layout/ArtistLayout";
import { EventFormContext } from "../../context/EventFormContext";
import type { LocationSearchResult, NominatimSearchItem, EventFormValues } from "../../types/event";
import L from "leaflet";
import { FileUploadField } from "../ui/FileUpload";

export const EditEvent = () => {
  const location = useLocation();
  const event = location.state?.event as EventListItem | undefined;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setValue, watch, getValues } = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      description: "",
      startDate: dayjs().toISOString(),
      endDate: dayjs().add(2, "hour").toISOString(),
      selectedLocationId: "",
      selectedArtistIds: [],
      isCreatingNewLocation: false,
      locationName: "",
      locationAddress: "",
      locationCity: "",
      locationZip: "",
      locationCountry: "",
      locationLat: "",
      locationLng: "",
      isCreatingNewArtist: false,
      artistName: "",
      artistGenres: [],
      artistDescription: "",
      artistWebsiteUrl: "",
      artistMusicUrls: [""],
    },
  });

  // Form state
  const title = watch("title");
  const description = watch("description");
  const startDateValue = watch("startDate");
  const endDateValue = watch("endDate");
  const selectedLocationId = watch("selectedLocationId");
  const selectedArtistIds = watch("selectedArtistIds");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const startDate = startDateValue ? dayjs(startDateValue) : null;
  const endDate = endDateValue ? dayjs(endDateValue) : null;
  const [showSavedArtistPreview, setShowSavedArtistPreview] = useState(false);
  const [lastCreatedArtistId, setLastCreatedArtistId] = useState<string | null>(null);
  const [savedArtistPreview, setSavedArtistPreview] = useState<{
    name: string;
    mainImageUrl?: string;
    description?: string;
    websiteUrl?: string;
    genres: string[];
    youtubeUrls: string[];
  } | null>(null);
  const artistPreviewObjectUrlRef = useRef<string | null>(null);

  // Location form state
  const isCreatingNewLocation = watch("isCreatingNewLocation");
  const locationName = watch("locationName");
  const locationAddress = watch("locationAddress");
  const locationCity = watch("locationCity");
  const locationZip = watch("locationZip");
  const locationCountry = watch("locationCountry");
  const locationLat = watch("locationLat");
  const locationLng = watch("locationLng");
  const [isGeocodingLocation, setIsGeocodingLocation] = useState(false);

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  const searchAbortRef = useRef<AbortController | null>(null);
  const searchDebounceRef = useRef<number | null>(null);

  // Artist form state
  const isCreatingNewArtist = watch("isCreatingNewArtist");
  const artistName = watch("artistName");
  const artistGenres = watch("artistGenres");
  const artistDescription = watch("artistDescription");
  const artistWebsiteUrl = watch("artistWebsiteUrl");
  const artistMusicUrls = watch("artistMusicUrls");
  const [artistMainImageFile, setArtistMainImageFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (artistPreviewObjectUrlRef.current) {
        URL.revokeObjectURL(artistPreviewObjectUrlRef.current);
        artistPreviewObjectUrlRef.current = null;
      }
    };
  }, []);

  // Fetch artists and locations
  const { data: artists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ["artists"],
    queryFn: artistsService.getArtists,
  });

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => locationsService.getLocations(),
  });

  // Create location mutation
  const createLocationMutation = useMutation({
    mutationFn: locationsService.createLocation,
    onSuccess: (newLocation) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      setValue("selectedLocationId", newLocation.id || newLocation._id || "");
      setValue("isCreatingNewLocation", false);
      // Clear location form
      setValue("locationName", "");
      setValue("locationAddress", "");
      setValue("locationCity", "");
      setValue("locationZip", "");
      setValue("locationCountry", "");
      setValue("locationLat", "");
      setValue("locationLng", "");
    },
    onError: (err: Error | unknown) => {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(error?.response?.data?.message || error?.message || "Failed to create location");
    },
  });

  // Create artist mutation
  const createArtistMutation = useMutation({
    mutationFn: artistsService.createArtist,
    onSuccess: (newArtist) => {
      if (artistPreviewObjectUrlRef.current) {
        URL.revokeObjectURL(artistPreviewObjectUrlRef.current);
        artistPreviewObjectUrlRef.current = null;
      }

      const fallbackLocalImageUrl = artistMainImageFile ? URL.createObjectURL(artistMainImageFile) : undefined;

      if (fallbackLocalImageUrl) {
        artistPreviewObjectUrlRef.current = fallbackLocalImageUrl;
      }

      queryClient.invalidateQueries({ queryKey: ["artists"] });
      const newArtistId = newArtist.id || newArtist._id || "";
      const prev = getValues("selectedArtistIds");
      setValue("selectedArtistIds", [...prev, newArtistId]);
      setValue("isCreatingNewArtist", false);
      setLastCreatedArtistId(newArtistId);
      setShowSavedArtistPreview(true);
      setSavedArtistPreview({
        name: newArtist.name,
        mainImageUrl: newArtist.mainImageUrl || newArtist.imageUrls?.[0] || fallbackLocalImageUrl,
        description: newArtist.description,
        websiteUrl: newArtist.websiteUrl,
        genres: newArtist.genres || [],
        youtubeUrls: (newArtist.musicResources || []).map((resource) => resource.url),
      });
      // Clear artist form
      setValue("artistName", "");
      setValue("artistGenres", []);
      setValue("artistDescription", "");
      setValue("artistWebsiteUrl", "");
      setValue("artistMusicUrls", [""]);
      setArtistMainImageFile(null);
    },
    onError: (err: Error | unknown) => {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(error?.response?.data?.message || error?.message || "Failed to create artist");
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => eventsService.updateEvent(id, payload),
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setTimeout(() => {
        navigate("/managed-events");
      }, 2400);
    },
    onError: (err: Error | unknown) => {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(error?.response?.data?.message || error?.message || "Failed to update event");
    },
  });

  // Get selected location for map preview
  const selectedLocation = locations.find((loc) => (loc.id || loc._id) === selectedLocationId);

  // Reverse geocode coordinates to get address
  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setValue("locationLat", lat.toString());
    setValue("locationLng", lng.toString());
    console.log("✓ Coordinates from map click:", { lat, lng });
    setError("");
    setIsGeocodingLocation(true);

    try {
      // Reverse geocode to get address
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: {
          "User-Agent": "NextUpLive Event Creation",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const addressData = data.address || {};

        // Auto-fill address fields from reverse geocoding
        setValue("locationName", data.name || "");
        setValue("locationAddress", data.name || addressData.road || "");
        setValue("locationCity", addressData.city || addressData.town || "");
        setValue("locationZip", addressData.postcode || "");
        setValue("locationCountry", addressData.country || "");

        // Auto-compute forward geocoding in background
        if ((data.name || addressData.road) && (addressData.city || addressData.town)) {
          setTimeout(() => {
            autoComputeCoordinatesSilent(
              data.name || addressData.road || "",
              addressData.city || addressData.town || "",
              addressData.postcode || "",
              addressData.country || "",
              lat,
              lng,
            );
          }, 300);
        }
      }
    } catch {
      setError("Failed to get address from map location");
    } finally {
      setIsGeocodingLocation(false);
    }
  };

  // Auto-compute coordinates silently (after reverse geocoding)
  const autoComputeCoordinatesSilent = async (
    address: string,
    city: string,
    zip: string,
    country: string,
    clickLat: number,
    clickLng: number,
  ) => {
    const addressParts = [address, city, zip, country].filter(Boolean);
    if (addressParts.length === 0) return;

    const query = addressParts.join(", ");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          headers: {
            "User-Agent": "NextUpLive Event Creation",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const forwardLat = parseFloat(data[0].lat);
          const forwardLng = parseFloat(data[0].lon);

          // Only update if close to clicked location (within ~1 degree)
          const distance = Math.abs(forwardLat - clickLat) + Math.abs(forwardLng - clickLng);
          if (distance < 1) {
            setValue("locationLat", forwardLat.toString());
            setValue("locationLng", forwardLng.toString());
          }
        }
      }
    } catch {
      // Fail silently
    }
  };

  // Auto-compute coordinates from address if not already set
  const autoComputeCoordinates = async (): Promise<boolean> => {
    if (locationLat && locationLng) {
      return true; // Already have coordinates
    }

    const addressParts = [locationAddress, locationCity, locationZip, locationCountry].filter(Boolean);

    if (addressParts.length === 0) {
      setError("Please select a location on the map or enter address details");
      return false;
    }

    const query = addressParts.join(", ");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          headers: {
            "User-Agent": "NextUpLive Event Creation",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setValue("locationLat", data[0].lat);
        setValue("locationLng", data[0].lon);
        return true;
      } else {
        setError("Could not compute coordinates for this address");
        return false;
      }
    } catch {
      setError("Failed to compute coordinates");
      return false;
    }
  };

  // Auto-compute coordinates silently (after reverse geocoding)
  const handleAddressFieldChange = (
    field: "locationAddress" | "locationCity" | "locationZip" | "locationCountry",
    value: string,
  ) => {
    setValue(field, value);
    // Clear coordinates if they were previously computed
    if (locationLat && locationLng) {
      setValue("locationLat", "");
      setValue("locationLng", "");
    }
  };

  // Handle location selection - auto-fill form fields
  const handleLocationSelect = (locationId: string) => {
    setValue("selectedLocationId", locationId);
    const location = locations.find((loc) => (loc.id || loc._id) === locationId);
    if (location) {
      setValue("locationName", location.name);
      setValue("locationAddress", location.address || "");
      setValue("locationCity", location.city || "");
      setValue("locationZip", location.zip || "");
      setValue("locationCountry", location.country || "");
      setValue("locationLat", location.geo.coordinates[1].toString());
      setValue("locationLng", location.geo.coordinates[0].toString());
      console.log("✓ Coordinates from existing location:", {
        lat: location.geo.coordinates[1],
        lng: location.geo.coordinates[0],
        name: location.name,
      });
    }
  };

  // Search for locations using free Nominatim (OpenStreetMap)
  const handleLocationSearch = (query: string) => {
    setSearchInput(query);

    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }

    if (query.trim().length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    const normalizedQuery = query.trim().toLowerCase();
    const germanQuery = /\b(germany|deutschland|de)\b/i.test(query.trim()) ? query.trim() : `${query.trim()}, Germany`;
    const localMatches: LocationSearchResult[] = locations
      .filter((location) => {
        const haystack = [
          location.name,
          location.address || "",
          location.city || "",
          location.country || "",
          location.zip || "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .slice(0, 5)
      .map((location) => ({
        name: location.name,
        displayName: [location.name, location.address, location.city, location.country].filter(Boolean).join(", "),
        lat: location.geo.coordinates[1],
        lng: location.geo.coordinates[0],
        address: location.address || "",
        city: location.city || "",
        country: location.country || "",
        zip: location.zip || "",
      }));

    if (localMatches.length > 0) {
      setSearchResults(localMatches);
      setShowSearchResults(true);
    }

    searchDebounceRef.current = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setError("");

        if (searchAbortRef.current) {
          searchAbortRef.current.abort();
        }
        searchAbortRef.current = new AbortController();

        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("q", germanQuery);
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("namedetails", "1");
        url.searchParams.set("limit", "8");
        url.searchParams.set("dedupe", "1");
        url.searchParams.set("countrycodes", "de");

        const response = await fetch(url.toString(), {
          signal: searchAbortRef.current.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = (await response.json()) as NominatimSearchItem[];

        const remoteResults: LocationSearchResult[] = data.map((item) => {
          const address = item.address ?? {};
          const street = [
            address.road || address.pedestrian || address.footway,
            address.house_number || address.building,
          ]
            .filter(Boolean)
            .join(" ")
            .trim();

          return {
            name: item.name || item.display_name.split(",")[0]?.trim() || "",
            displayName: item.display_name,
            lat: Number(item.lat),
            lng: Number(item.lon),
            address: street || "",
            city: address.city || address.town || address.village || address.county || "",
            country: address.country || "",
            zip: address.postcode || "",
          };
        });

        const mergedResults = [...localMatches, ...remoteResults].filter(
          (result, index, self) =>
            index ===
            self.findIndex(
              (other) =>
                other.displayName === result.displayName &&
                Math.abs(other.lat - result.lat) < 0.000001 &&
                Math.abs(other.lng - result.lng) < 0.000001,
            ),
        );

        setSearchResults(mergedResults);
        setShowSearchResults(mergedResults.length > 0);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (localMatches.length === 0) {
          setSearchResults([]);
          setShowSearchResults(false);
          setError("No suggestions found for this address");
        }
      } finally {
        setIsSearching(false);
      }
    }, 450);
  };

  // Select a search result and auto-fill form
  const handleSelectSearchResult = (result: LocationSearchResult) => {
    setValue("locationName", result.name);
    setValue("locationAddress", result.address || "");
    setValue("locationCity", result.city || "");
    setValue("locationZip", result.zip || "");
    setValue("locationCountry", result.country || "");
    setValue("locationLat", result.lat.toString());
    setValue("locationLng", result.lng.toString());
    console.log("✓ Coordinates from search result:", {
      lat: result.lat,
      lng: result.lng,
      name: result.name,
    });
    setSearchInput(result.displayName);
    setShowSearchResults(false);
  };

  useEffect(() => {
    if (!event) return;

    setValue("title", event.title ?? "");
    setValue("description", event.description ?? "");
    setValue("startDate", event.startDate ?? dayjs().toISOString());
    setValue("endDate", event.endDate ?? dayjs().add(2, "hour").toISOString());
    setValue("selectedLocationId", event.location?.id ?? "");
    setValue("selectedArtistIds", event.artists?.map((artist) => artist.id) ?? []);
  }, [event, setValue]);

  // Handle creating new location with auto-computed coordinates
  const handleCreateLocation = async () => {
    setError("");

    // Validate location fields
    if (!locationName.trim()) {
      setError("Location name is required");
      return;
    }

    // Auto-compute coordinates if not already set
    const coordsSuccess = await autoComputeCoordinates();
    if (!coordsSuccess) {
      return;
    }

    const lat = parseFloat(locationLat);
    const lng = parseFloat(locationLng);

    if (isNaN(lat) || isNaN(lng)) {
      setError("Invalid coordinates");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError("Invalid coordinates");
      return;
    }

    createLocationMutation.mutate({
      name: locationName,
      address: locationAddress,
      city: locationCity,
      zip: locationZip,
      country: locationCountry,
      geo: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });
  };

  // Handle artist selection toggle
  const handleArtistSelect = (artistId: string) => {
    const prev = getValues("selectedArtistIds");
    setValue("selectedArtistIds", prev.includes(artistId) ? prev.filter((id) => id !== artistId) : [...prev, artistId]);
  };

  // Handle artist genre toggle
  const handleArtistGenreToggle = (genre: string) => {
    const prev = getValues("artistGenres");
    setValue("artistGenres", prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]);
  };

  // Handle creating new artist
  const handleCreateArtist = () => {
    setError("");

    // Validate artist fields
    if (!artistName.trim()) {
      setError("Artist name is required");
      return;
    }

    if (artistGenres.length === 0) {
      setError("Please select at least one genre for the artist");
      return;
    }

    createArtistMutation.mutate({
      name: artistName,
      genres: artistGenres,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    setError("");

    if (!event?.id) {
      setError("Missing event id");
      return;
    }
    if (!title.trim()) {
      setError("Event title is required");
      return;
    }
    if (isCreatingNewLocation) {
      setError("Please save the location first before updating the event");
      return;
    }
    if (isCreatingNewArtist) {
      setError("Please save the artist first before updating the event");
      return;
    }
    if (!selectedLocationId) {
      setError("Please select or create a location");
      return;
    }
    if (selectedArtistIds.length === 0) {
      setError("Please select at least one artist");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }
    if (endDate.isBefore(startDate)) {
      setError("End date must be after start date");
      return;
    }

    updateEventMutation.mutate({
      id: event.id,
      payload: {
        title,
        description,
        locationId: selectedLocationId,
        artistsIds: selectedArtistIds,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  };
  const handleDelete = async () => {
    if (!event || !event.id) return;

    await eventsService.deleteEvent(event.id);
    navigate("/managed-events");
  };
  const eventFormContextValue = {
    isCreatingNewLocation,
    selectedLocationId,
    locationName,
    locationAddress,
    locationCity,
    locationZip,
    locationCountry,
    locationLat,
    locationLng,
    isGeocodingLocation,
    locationsLoading,
    createLocationMutationIsPending: createLocationMutation.isPending,
    locations,
    selectedLocation,
    searchInput,
    searchResults,
    isSearching,
    showSearchResults,
    onToggleCreateNewLocation: () => {
      setValue("isCreatingNewLocation", true);
      setValue("selectedLocationId", "");
      setValue("locationName", "");
      setValue("locationAddress", "");
      setValue("locationCity", "");
      setValue("locationZip", "");
      setValue("locationCountry", "");
      setValue("locationLat", "");
      setValue("locationLng", "");
    },
    onToggleSelectExistingLocation: () => {
      setValue("isCreatingNewLocation", false);
    },
    onLocationSelect: handleLocationSelect,
    onLocationNameChange: (value: string) => setValue("locationName", value),
    onLocationAddressChange: (value: string) => handleAddressFieldChange("locationAddress", value),
    onLocationCityChange: (value: string) => handleAddressFieldChange("locationCity", value),
    onLocationZipChange: (value: string) => handleAddressFieldChange("locationZip", value),
    onLocationCountryChange: (value: string) => handleAddressFieldChange("locationCountry", value),
    onCreateLocation: handleCreateLocation,
    onMapClick: handleMapClick,
    onLocationSearch: handleLocationSearch,
    onSelectSearchResult: handleSelectSearchResult,
    isCreatingNewArtist,
    selectedArtistIds,
    artistName,
    artistGenres,
    artistDescription,
    artistWebsiteUrl,
    artistMusicUrls,
    artistsLoading,
    createArtistMutationIsPending: createArtistMutation.isPending,
    artists,
    onToggleCreateNewArtist: () => {
      setValue("isCreatingNewArtist", true);
      setValue("artistName", "");
      setValue("artistGenres", []);
      setValue("artistDescription", "");
      setValue("artistWebsiteUrl", "");
      setValue("artistMusicUrls", [""]);
      setArtistMainImageFile(null);
    },
    onToggleSelectExistingArtist: () => setValue("isCreatingNewArtist", false),
    onArtistSelect: handleArtistSelect,
    onArtistNameChange: (value: string) => setValue("artistName", value),
    onArtistGenreToggle: handleArtistGenreToggle,
    onArtistDescriptionChange: (value: string) => setValue("artistDescription", value),
    onArtistWebsiteUrlChange: (value: string) => setValue("artistWebsiteUrl", value),
    onArtistMusicUrlChange: (index: number, value: string) => {
      const next = [...getValues("artistMusicUrls")];
      next[index] = value;
      setValue("artistMusicUrls", next);
    },
    onAddArtistMusicUrl: () => setValue("artistMusicUrls", [...getValues("artistMusicUrls"), ""]),
    onRemoveArtistMusicUrl: (index: number) => {
      const next = getValues("artistMusicUrls").filter((_, i) => i !== index);
      setValue("artistMusicUrls", next.length > 0 ? next : [""]);
    },
    onArtistMainImageFileChange: setArtistMainImageFile,
    showSavedArtistPreview,
    savedArtistPreview,
    onEditSavedArtist: () => {
      if (savedArtistPreview) {
        setValue("artistName", savedArtistPreview.name || "");
        setValue("artistDescription", savedArtistPreview.description || "");
        setValue("artistWebsiteUrl", savedArtistPreview.websiteUrl || "");
        setValue("artistGenres", savedArtistPreview.genres || []);
        setValue("artistMusicUrls", savedArtistPreview.youtubeUrls?.length > 0 ? savedArtistPreview.youtubeUrls : [""]);
      }

      if (lastCreatedArtistId) {
        const next = getValues("selectedArtistIds").filter((id) => String(id) !== String(lastCreatedArtistId));
        setValue("selectedArtistIds", next);
      }

      setShowSavedArtistPreview(false);
      setArtistMainImageFile(null);
    },
    onCreateArtist: handleCreateArtist,
  };
  return (
    <div className="relative z-20 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Managed Events</h1>
          <p className="text-gray-400">Edit your saved events</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
            Event updated successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <form
          className="max-w-4xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-6">
              <EventFormContext.Provider value={eventFormContextValue}>
                <LocationLayout />

                <ArtistLayout />
              </EventFormContext.Provider>
            </div>
            <div
              className={`bg-purple/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 space-y-6 transition-all duration-300 ${
                isDateRangePickerOpen ? "pb-120" : ""
              }`}
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="h-6 w-6" />
                Event Information
              </h2>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setValue("title", e.target.value)}
                  placeholder="e.g., Summer Music Festival 2026"
                  className="w-full px-4 py-3 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setValue("description", e.target.value)}
                  placeholder="Describe your event..."
                  rows={4}
                  className="w-full px-4 py-3 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
                />
              </div>

              {/* Date Range Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Start & End *</label>
                <DateTimeRangePicker
                  startValue={startDate ? startDate.toDate() : null}
                  endValue={endDate ? endDate.toDate() : null}
                  onOpenChange={setIsDateRangePickerOpen}
                  onChange={(nextStart, nextEnd) => {
                    setValue("startDate", nextStart ? dayjs(nextStart).toISOString() : "");
                    setValue("endDate", nextEnd ? dayjs(nextEnd).toISOString() : "");
                  }}
                />
              </div>

              {/* Image Upload for Event */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image Upload</label>
                <FileUploadField uploadType="artistImage" onFileChange={() => {}} />
              </div>

              {/* Save Button */}
              <div className="flex flex-row gap-2">
                <button
                  type="submit"
                  disabled={updateEventMutation.isPending}
                  className="w-full bg-linear-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  {updateEventMutation.isPending ? "Saving Event..." : "Update Event"}
                </button>
                {selectedLocationId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex cursor-pointer items-center justify-center px-3 py-2 rounded-lg bg-purple-600 border border-purple-500/50 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    aria-label="Delete selected location"
                    title="Delete selected location"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
