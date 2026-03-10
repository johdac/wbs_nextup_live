import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin, Save } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import L from "leaflet";
import { useAuth } from "../../context/AuthContext";
import {
  locationsService,
  type UpdateLocationInput,
} from "../../services/locationsApi";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: L.LatLngTuple = [52.52, 13.405];

export const ManagedLocations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
    queryKey: ["managedLocations", user?._id],
    queryFn: () => locationsService.getLocations(user?._id),
    enabled: Boolean(user?._id),
  });

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
        queryKey: ["managedLocations", user?._id],
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
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
            setCity(
              addressData.city || addressData.town || addressData.village || "",
            );
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
        markerRef.current = L.marker([parsedLat, parsedLng]).addTo(
          mapRef.current,
        );
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

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            Managed Locations
          </h1>
          <p className="text-gray-400">Select and edit your saved locations</p>
        </div>

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

        <div className="bg-purple/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Location
          </h2>

          <div className="mb-4">
            <div className="relative">
              <select
                value={selectedLocationId}
                onChange={(e) => {
                  const locationId = e.target.value;
                  setSelectedLocationId(locationId);

                  const selectedLocation = locations.find(
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
                className="w-full px-4 py-3 pr-10 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition appearance-none"
                style={{ backgroundColor: "#110b27" }}
                disabled={locationsLoading}
              >
                <option value="">
                  {locationsLoading
                    ? "Loading your locations..."
                    : "Select a location to edit"}
                </option>
                {locations.map((location) => (
                  <option
                    key={location.id || location._id}
                    value={location.id || location._id}
                  >
                    {location.name} - {location.city || "Unknown City"}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            </div>
          </div>

          {selectedLocationId && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Zip
                  </label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={updateLocationMutation.isPending}
                className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {updateLocationMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          )}

          <div className="w-full h-72 bg-black/40 rounded-lg border border-purple-500/30 overflow-hidden">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
