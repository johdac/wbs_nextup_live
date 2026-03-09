import { useRef, useEffect, useState, type MutableRefObject } from "react";
import { MapPin, Loader } from "lucide-react";
import L from "leaflet";
import { useEventFormContext } from "../../context/EventFormContext";
// @ts-expect-error CSS imports are valid but not typed
import "leaflet/dist/leaflet.css";

const DEFAULT_CREATE_MAP_CENTER: L.LatLngTuple = [52.52, 13.405];
const DEFAULT_CREATE_MAP_ZOOM = 5;

export const LocationLayout = () => {
  const {
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
    createLocationMutationIsPending,
    locations,
    selectedLocation,
    searchInput,
    searchResults,
    isSearching,
    showSearchResults,
    onToggleCreateNewLocation,
    onToggleSelectExistingLocation,
    onLocationSelect,
    onLocationNameChange,
    onLocationAddressChange,
    onLocationCityChange,
    onLocationZipChange,
    onLocationCountryChange,
    onCreateLocation,
    onMapClick,
    onLocationSearch,
    onSelectSearchResult,
  } = useEventFormContext();

  const [validationError, setValidationError] = useState("");

  const createMapContainer = useRef<HTMLDivElement>(null);
  const createMap = useRef<L.Map | null>(null);
  const createMarker = useRef<L.Marker | null>(null);

  const previewMapContainer = useRef<HTMLDivElement>(null);
  const previewMap = useRef<L.Map | null>(null);
  const previewMarker = useRef<L.Marker | null>(null);

  const safelyRemoveMap = (
    mapRef: MutableRefObject<L.Map | null>,
    markerRef: MutableRefObject<L.Marker | null>,
  ) => {
    if (!mapRef.current) {
      return;
    }

    try {
      mapRef.current.off();
      mapRef.current.remove();
    } catch (error) {
      console.warn("Failed to remove map instance safely", error);
    } finally {
      mapRef.current = null;
      markerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isCreatingNewLocation) {
      safelyRemoveMap(createMap, createMarker);
      return;
    }

    if (createMapContainer.current && !createMap.current) {
      const hasCoords = Boolean(locationLat && locationLng);
      const lat = hasCoords
        ? parseFloat(locationLat)
        : DEFAULT_CREATE_MAP_CENTER[0];
      const lng = hasCoords
        ? parseFloat(locationLng)
        : DEFAULT_CREATE_MAP_CENTER[1];
      const zoom = hasCoords ? 13 : DEFAULT_CREATE_MAP_ZOOM;

      createMap.current = L.map(createMapContainer.current).setView(
        [lat, lng],
        zoom,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(createMap.current);

      if (hasCoords) {
        createMarker.current = L.marker([lat, lng]).addTo(createMap.current);
      }
    }
  }, [isCreatingNewLocation, locationLat, locationLng]);

  useEffect(() => {
    if (!isCreatingNewLocation || !createMap.current) {
      return;
    }

    createMap.current.on("click", onMapClick);

    return () => {
      createMap.current?.off("click", onMapClick);
    };
  }, [isCreatingNewLocation, onMapClick]);

  useEffect(() => {
    if (
      !isCreatingNewLocation ||
      !createMap.current ||
      !locationLat ||
      !locationLng
    ) {
      return;
    }

    const lat = parseFloat(locationLat);
    const lng = parseFloat(locationLng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    createMap.current.setView([lat, lng], createMap.current.getZoom());

    if (createMarker.current) {
      createMarker.current.setLatLng([lat, lng]);
    } else {
      createMarker.current = L.marker([lat, lng]).addTo(createMap.current);
    }
  }, [isCreatingNewLocation, locationLat, locationLng]);

  useEffect(() => {
    if (
      isCreatingNewLocation ||
      !selectedLocation ||
      !previewMapContainer.current
    ) {
      safelyRemoveMap(previewMap, previewMarker);
      return;
    }

    const lat = selectedLocation.geo.coordinates[1];
    const lng = selectedLocation.geo.coordinates[0];

    if (!previewMap.current) {
      previewMap.current = L.map(previewMapContainer.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([lat, lng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(previewMap.current);
    } else {
      previewMap.current.setView([lat, lng], 15);
    }

    if (previewMarker.current) {
      previewMarker.current.setLatLng([lat, lng]);
    } else {
      previewMarker.current = L.marker([lat, lng]).addTo(previewMap.current);
    }
  }, [isCreatingNewLocation, selectedLocation]);

  useEffect(() => {
    return () => {
      safelyRemoveMap(createMap, createMarker);
      safelyRemoveMap(previewMap, previewMarker);
    };
  }, []);

  const handleCreateLocation = () => {
    setValidationError("");

    // Validate fields
    if (!locationName.trim()) {
      setValidationError("Please enter a location name");
      return;
    }

    if (!locationAddress.trim() || locationAddress.length < 2) {
      setValidationError(
        "Please enter a valid address (at least 2 characters)",
      );
      return;
    }

    if (!locationLat || !locationLng) {
      setValidationError("Please select a location on the map");
      return;
    }

    // All valid, proceed
    onCreateLocation();
  };

  return (
    <div className="bg-purple/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <MapPin className="h-6 w-6" />
        Location *
      </h2>

      {/* Toggle between Select Existing and Create New */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={onToggleSelectExistingLocation}
          className={`flex-1 cursor-pointer px-4 py-2 rounded-lg font-medium transition ${
            !isCreatingNewLocation
              ? "bg-purple-500 text-white"
              : "bg-black/40 text-gray-400 hover:bg-black/60"
          }`}
        >
          Select Existing
        </button>
        <button
          type="button"
          onClick={onToggleCreateNewLocation}
          className={`flex-1 cursor-pointer px-4 py-2 rounded-lg font-medium transition ${
            isCreatingNewLocation
              ? "bg-purple-500 text-white"
              : "bg-black/40 text-gray-400 hover:bg-black/60"
          }`}
        >
          Create New
        </button>
      </div>

      {!isCreatingNewLocation ? (
        <>
          {/* Location Selector */}
          <div className="mb-4">
            <select
              value={selectedLocationId}
              onChange={(e) => onLocationSelect(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
              disabled={locationsLoading}
              required
            >
              <option value="">
                {locationsLoading
                  ? "Loading locations..."
                  : "Select a location"}
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
          </div>
        </>
      ) : (
        <>
          {/* Create New Location Form */}
          <div className="space-y-3 mb-4">
            {/* Location Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Search Location
              </label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => onLocationSearch(e.target.value)}
                placeholder="Search address, place, business..."
                className="w-full px-4 py-3 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />

              {isSearching && (
                <p className="mt-2 text-xs text-gray-400">Searching...</p>
              )}

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto rounded-lg border border-purple-500/40 bg-black/90 shadow-xl">
                  {searchResults.map((result, idx) => (
                    <button
                      key={`${result.lat}-${result.lng}-${idx}`}
                      type="button"
                      onClick={() => onSelectSearchResult(result)}
                      className="w-full text-left px-4 py-3 hover:bg-purple-500/20 border-b border-purple-500/20 last:border-b-0"
                    >
                      <div className="text-white text-sm font-medium">
                        {result.name || result.displayName}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {result.displayName}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Location Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => onLocationNameChange(e.target.value)}
                placeholder="e.g., Central Arena"
                className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>{" "}
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => onLocationAddressChange(e.target.value)}
                placeholder="e.g., 123 Main St"
                className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            {/* City and Zip */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={locationCity}
                  onChange={(e) => onLocationCityChange(e.target.value)}
                  placeholder="e.g., Berlin"
                  className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Zip
                </label>
                <input
                  type="text"
                  value={locationZip}
                  onChange={(e) => onLocationZipChange(e.target.value)}
                  placeholder="e.g., 10115"
                  className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value={locationCountry}
                onChange={(e) => onLocationCountryChange(e.target.value)}
                placeholder="e.g., Germany"
                className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{validationError}</p>
              </div>
            )}
            {/* Create Location Button */}
            <button
              type="button"
              onClick={handleCreateLocation}
              disabled={createLocationMutationIsPending}
              className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createLocationMutationIsPending
                ? "Creating..."
                : "Save Location"}
            </button>
          </div>
        </>
      )}

      {/* Map Preview/Interactive Map */}
      <div className="w-full h-64 bg-black/40 rounded-lg border border-purple-500/30 overflow-hidden">
        {isCreatingNewLocation ? (
          <div
            key="create-map"
            ref={createMapContainer}
            className="w-full h-full"
            style={{ position: "relative" }}
          />
        ) : selectedLocation ? (
          <div
            key="preview-map"
            ref={previewMapContainer}
            className="w-full h-full"
            style={{ position: "relative" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Select a location to preview map</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Instructions for Create New */}
      {isCreatingNewLocation && (
        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
          <p className="text-xs text-blue-400">
            💡 Click on the map to select the event location.
          </p>
        </div>
      )}

      {/* Loading indicator while geocoding */}
      {isCreatingNewLocation && isGeocodingLocation && (
        <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center justify-center gap-2">
          <Loader className="h-4 w-4 animate-spin text-orange-400" />
          <p className="text-xs text-orange-400">Getting address details...</p>
        </div>
      )}

      {/* Location Details */}
      {(selectedLocation || locationName) && (
        <div className="mt-4 p-3 bg-black/20 rounded-lg">
          <p className="text-white font-medium">
            {selectedLocation?.name || locationName}
          </p>
          {(selectedLocation?.address || locationAddress) && (
            <p className="text-gray-400 text-sm">
              {selectedLocation?.address || locationAddress}
            </p>
          )}
          {(selectedLocation?.city || locationCity) && (
            <p className="text-gray-400 text-sm">
              {selectedLocation?.city || locationCity}
              {(selectedLocation?.country || locationCountry) &&
                `, ${selectedLocation?.country || locationCountry}`}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
