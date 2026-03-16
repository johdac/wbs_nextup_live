import { useEffect, useMemo, useState } from "react";
// import { Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import L from "leaflet";
import { useAuth } from "../../context/AuthContext";
import {
  EventFormContext,
  type EventFormContextValue,
  type LocationSearchResult,
} from "../../context/EventFormContext";
import {
  locationsService,
  type UpdateLocationInput,
} from "../../services/locationsApi";
import { Heading } from "../ui/Heading";
import { GoBackBtn } from "../buttons/GoBackBtn";
import { LocationLayout } from "../layout/LocationLayout";

type EditLocationProps = {
  preselectedLocationId?: string;
};

export const EditLocation = ({
  preselectedLocationId,
}: EditLocationProps = {}) => {
  const { id: routeLocationId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentUserId = String(
    (user as { _id?: string; id?: string } | null)?._id ||
      (user as { _id?: string; id?: string } | null)?.id ||
      "",
  );

  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isGeocodingLocation, setIsGeocodingLocation] = useState(false);

  const selectedFromRouteOrProp =
    routeLocationId || preselectedLocationId || "";

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["managedLocations", currentUserId],
    queryFn: () => locationsService.getLocations(currentUserId),
    enabled: Boolean(currentUserId),
  });

  const ownedLocations = useMemo(
    () =>
      locations.filter((location) => {
        const owner = location.createdById;
        if (!owner) {
          return false;
        }

        const ownerId =
          typeof owner === "string"
            ? owner
            : owner._id || (owner as { id?: string }).id || "";

        return String(ownerId) === currentUserId;
      }),
    [locations, currentUserId],
  );

  const selectedLocation = useMemo(
    () =>
      ownedLocations.find(
        (location) =>
          String(location.id || location._id || "") ===
          String(selectedLocationId),
      ),
    [ownedLocations, selectedLocationId],
  );

  const updateLocationMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLocationInput;
    }) => locationsService.updateLocation(id, payload),
    onSuccess: () => {
      setSuccess("Location updated successfully.");
      setError("");
      queryClient.invalidateQueries({
        queryKey: ["managedLocations", currentUserId],
      });
    },
    onError: (err: Error | unknown) => {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setSuccess("");
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update location.",
      );
    },
  });

  // const deleteLocationMutation = useMutation({
  //   mutationFn: (id: string) => locationsService.deleteLocation(id),
  //   onSuccess: () => {
  //     setSuccess("Location deleted successfully.");
  //     setError("");
  //     setSelectedLocationId("");
  //     setName("");
  //     setAddress("");
  //     setCity("");
  //     setZip("");
  //     setCountry("");
  //     setLat("");
  //     setLng("");
  //     queryClient.invalidateQueries({
  //       queryKey: ["managedLocations", currentUserId],
  //     });
  //   },
  //   onError: (err: Error | unknown) => {
  //     const error = err as {
  //       response?: { data?: { message?: string } };
  //       message?: string;
  //     };
  //     setSuccess("");
  //     setError(
  //       error?.response?.data?.message ||
  //         error?.message ||
  //         "Failed to delete location.",
  //     );
  //   },
  // });

  useEffect(() => {
    if (!success) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [success]);

  const setFormFromLocation = (locationId: string) => {
    const nextLocation = ownedLocations.find(
      (location) =>
        String(location.id || location._id || "") === String(locationId),
    );

    if (!nextLocation) {
      return;
    }

    setSelectedLocationId(locationId);
    setName(nextLocation.name || "");
    setAddress(nextLocation.address || "");
    setCity(nextLocation.city || "");
    setZip(nextLocation.zip || "");
    setCountry(nextLocation.country || "");
    setLat(nextLocation.geo.coordinates[1].toString());
    setLng(nextLocation.geo.coordinates[0].toString());
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    if (!selectedFromRouteOrProp || locationsLoading) {
      return;
    }

    if (String(selectedLocationId) === String(selectedFromRouteOrProp)) {
      return;
    }

    setFormFromLocation(String(selectedFromRouteOrProp));
  }, [
    selectedFromRouteOrProp,
    locationsLoading,
    ownedLocations,
    selectedLocationId,
  ]);

  const handleSave = () => {
    setError("");
    setSuccess("");

    if (!selectedLocationId) {
      setError("Please select a location.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter a location name.");
      return;
    }

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      setError("Please select valid coordinates on the map.");
      return;
    }

    updateLocationMutation.mutate({
      id: selectedLocationId,
      payload: {
        name,
        address,
        city,
        zip,
        country,
        geo: {
          type: "Point",
          coordinates: [parsedLng, parsedLat],
        },
      },
    });
  };

  // const handleDelete = () => {
  //   if (!selectedLocationId) {
  //     setError("Please select a location.");
  //     return;
  //   }

  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this location?",
  //   );
  //   if (!confirmed) {
  //     return;
  //   }

  //   setError("");
  //   setSuccess("");
  //   deleteLocationMutation.mutate(selectedLocationId);
  // };

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat: clickLat, lng: clickLng } = e.latlng;
    setLat(clickLat.toString());
    setLng(clickLng.toString());
    setError("");
    setIsGeocodingLocation(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickLat}&lon=${clickLng}`,
        {
          headers: {
            "User-Agent": "NextUpLive Managed Locations",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const addressData = data.address || {};
        setAddress(data.name || addressData.road || "");
        setCity(
          addressData.city || addressData.town || addressData.village || "",
        );
        setZip(addressData.postcode || "");
        setCountry(addressData.country || "");
      }
    } catch {
      setError("Failed to get address from map location.");
    } finally {
      setIsGeocodingLocation(false);
    }
  };

  const handleSelectSearchResult = (result: LocationSearchResult) => {
    setName(result.name || "");
    setAddress(result.address || "");
    setCity(result.city || "");
    setZip(result.zip || "");
    setCountry(result.country || "");
    setLat(result.lat.toString());
    setLng(result.lng.toString());
  };

  const eventFormContextValue: EventFormContextValue = {
    isCreatingNewLocation: true,
    selectedLocationId,
    locationName: name,
    locationAddress: address,
    locationCity: city,
    locationZip: zip,
    locationCountry: country,
    locationLat: lat,
    locationLng: lng,
    isGeocodingLocation,
    locationsLoading,
    createLocationMutationIsPending: updateLocationMutation.isPending,
    locations: ownedLocations,
    selectedLocation,
    searchInput: "",
    searchResults: [],
    isSearching: false,
    showSearchResults: false,
    onToggleCreateNewLocation: () => {},
    onStartEditLocation: () => {},
    onToggleSelectExistingLocation: () => {},
    onLocationSelect: setFormFromLocation,
    onLocationNameChange: setName,
    onLocationAddressChange: setAddress,
    onLocationCityChange: setCity,
    onLocationZipChange: setZip,
    onLocationCountryChange: setCountry,
    onCreateLocation: handleSave,
    onMapClick: handleMapClick,
    onLocationSearch: () => {},
    onSelectSearchResult: handleSelectSearchResult,

    isCreatingNewArtist: false,
    selectedArtistIds: [],
    artistName: "",
    artistGenres: [],
    artistDescription: "",
    artistWebsiteUrl: "",
    artistMusicUrls: [{ title: "", url: "" }],
    artistMainImagePreviewUrl: undefined,
    artistsLoading: false,
    createArtistMutationIsPending: false,
    artists: [],
    onToggleCreateNewArtist: () => {},
    onToggleSelectExistingArtist: () => {},
    onArtistSelect: () => {},
    onArtistNameChange: () => {},
    onArtistGenreToggle: () => {},
    onArtistDescriptionChange: () => {},
    onArtistWebsiteUrlChange: () => {},
    onArtistMusicUrlChange: () => {},
    onAddArtistMusicUrl: () => {},
    onRemoveArtistMusicUrl: () => {},
    onArtistMainImageFileChange: () => {},
    showSavedArtistPreview: false,
    savedArtistPreviewId: null,
    savedArtistPreview: null,
    onEditSavedArtist: () => {},
    onLoadArtistForEdit: () => {},
    onCancelArtistEdit: () => {},
    onCreateArtist: async () => {},
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex justify-between">
          <GoBackBtn path="/managed-locations" />
        </div>

        <Heading
          title="Managed Locations"
          subtitle="Select and edit your saved locations"
        />

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
            {success}
          </div>
        )}
        {/* Mingshen: we might not need a delete button here. If users want to delete the location, they would delete it before coming to editpage */}
        {/* <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={handleDelete}
            disabled={!selectedLocationId || deleteLocationMutation.isPending}
            className="inline-flex cursor-pointer items-center justify-center px-3 py-2 rounded-lg bg-purple-600 border border-purple-500/50 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Delete selected location"
            title="Delete selected location"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div> */}

        <EventFormContext.Provider value={eventFormContextValue}>
          <LocationLayout mode="standalone" />
        </EventFormContext.Provider>
      </div>
    </div>
  );
};
