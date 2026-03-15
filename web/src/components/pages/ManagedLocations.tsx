import { useEffect, useRef, useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import L from "leaflet";
import { useAuth } from "../../context/AuthContext";
import { LocationSelectDropdown } from "../location/LocationSelectDropdown";
import { LocationFormFields } from "../location/LocationFormFields";
import { locationsService, type UpdateLocationInput } from "../../services/locationsApi";
import "leaflet/dist/leaflet.css";
import { Heading } from "../ui/Heading";

const DEFAULT_CENTER: L.LatLngTuple = [52.52, 13.405];

interface ManagedLocationsProps {
  preselectedLocationId?: string;
}

export const ManagedLocations = ({ preselectedLocationId }: ManagedLocationsProps = {}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentUserId = String(
    (user as { _id?: string; id?: string } | null)?._id || (user as { _id?: string; id?: string } | null)?.id || "",
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

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["managedLocations", currentUserId],
    queryFn: () => locationsService.getLocations(currentUserId),
    enabled: Boolean(currentUserId),
  });

  const ownedLocations = locations.filter((location) => {
    const owner = location.createdById;
    if (!owner) {
      return false;
    }

    const ownerId = typeof owner === "string" ? owner : owner._id || (owner as { id?: string }).id || "";

    return String(ownerId) === currentUserId;
  });

  const updateLocationMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLocationInput }) =>
      locationsService.updateLocation(id, payload),
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
      setError(error?.response?.data?.message || error?.message || "Failed to update location.");
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: (id: string) => locationsService.deleteLocation(id),
    onSuccess: () => {
      setSuccess("Location deleted successfully.");
      setError("");
      setSelectedLocationId("");
      setName("");
      setAddress("");
      setCity("");
      setZip("");
      setCountry("");
      setLat("");
      setLng("");
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
      setError(error?.response?.data?.message || error?.message || "Failed to delete location.");
    },
  });

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    const hasCoords = !Number.isNaN(parsedLat) && !Number.isNaN(parsedLng);

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        hasCoords ? [parsedLat, parsedLng] : DEFAULT_CENTER,
        hasCoords ? 13 : 5,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      mapRef.current.on("click", async (e: L.LeafletMouseEvent) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        setLat(clickLat.toString());
        setLng(clickLng.toString());

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
            setCity(addressData.city || addressData.town || addressData.village || "");
            setZip(addressData.postcode || "");
            setCountry(addressData.country || "");
          }
        } catch {
          setError("Failed to get address from map location.");
        }
      });
    }

    if (!mapRef.current) {
      return;
    }

    if (hasCoords) {
      mapRef.current.setView([parsedLat, parsedLng], 13);
      if (!markerRef.current) {
        markerRef.current = L.marker([parsedLat, parsedLng]).addTo(mapRef.current);
      } else {
        markerRef.current.setLatLng([parsedLat, parsedLng]);
      }
    }
  }, [lat, lng]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
      }
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

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

  const handleDelete = () => {
    if (!selectedLocationId) {
      setError("Please select a location.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this location?");
    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    deleteLocationMutation.mutate(selectedLocationId);
  };

  useEffect(() => {
    if (!preselectedLocationId || locationsLoading) {
      return;
    }

    if (selectedLocationId === preselectedLocationId) {
      return;
    }

    const selectedLocation = ownedLocations.find((location) => (location.id || location._id) === preselectedLocationId);

    if (!selectedLocation) {
      return;
    }

    setSelectedLocationId(preselectedLocationId);
    setName(selectedLocation.name || "");
    setAddress(selectedLocation.address || "");
    setCity(selectedLocation.city || "");
    setZip(selectedLocation.zip || "");
    setCountry(selectedLocation.country || "");
    setLat(selectedLocation.geo.coordinates[1].toString());
    setLng(selectedLocation.geo.coordinates[0].toString());
    setError("");
    setSuccess("");
  }, [preselectedLocationId, locationsLoading, ownedLocations, selectedLocationId]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Heading title="Managed Locations" subtitle="Select and edit your saved locations" />

        {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">{error}</div>}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">{success}</div>
        )}

        <div className="bg-purple/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Location
            </h2>
            {selectedLocationId && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLocationMutation.isPending}
                className="inline-flex cursor-pointer items-center justify-center px-3 py-2 rounded-lg bg-purple-600 border border-purple-500/50 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Delete selected location"
                title="Delete selected location"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mb-4">
            <LocationSelectDropdown
              value={selectedLocationId}
              onChange={(locationId) => {
                setSelectedLocationId(locationId);

                const selectedLocation = ownedLocations.find(
                  (location) => (location.id || location._id) === locationId,
                );

                if (!selectedLocation) {
                  return;
                }

                setName(selectedLocation.name || "");
                setAddress(selectedLocation.address || "");
                setCity(selectedLocation.city || "");
                setZip(selectedLocation.zip || "");
                setCountry(selectedLocation.country || "");
                setLat(selectedLocation.geo.coordinates[1].toString());
                setLng(selectedLocation.geo.coordinates[0].toString());
                setError("");
                setSuccess("");
              }}
              options={ownedLocations}
              disabled={locationsLoading}
              loading={locationsLoading}
              loadingText="Loading your locations..."
              placeholder="Select a location to edit"
            />
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              selectedLocationId
                ? "max-h-screen opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            {selectedLocationId && (
              <LocationFormFields
                name={name}
                address={address}
                city={city}
                zip={zip}
                country={country}
                onNameChange={setName}
                onAddressChange={setAddress}
                onCityChange={setCity}
                onZipChange={setZip}
                onCountryChange={setCountry}
                onSubmit={handleSave}
                submitLabel="Save Changes"
                pendingLabel="Saving..."
                isSubmitting={updateLocationMutation.isPending}
              />
            )}
          </div>

          <div
            className={`w-full cursor-pointer h-72 bg-black/40 rounded-lg border border-purple-500/30 overflow-hidden transition-all duration-300 ${
              selectedLocationId ? "ring-1 ring-purple-500/30" : ""
            }`}
          >
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
