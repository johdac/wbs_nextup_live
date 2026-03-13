import { useRef, useEffect, useState, type MutableRefObject } from "react";
import { MapPin, Loader } from "lucide-react";
import L from "leaflet";
import { useEventFormContext } from "../../context/EventFormContext";
import { LocationSelectDropdown } from "../location/LocationSelectDropdown";
import { LocationFormFields } from "../location/LocationFormFields";
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
              ? "bg-primary text-white"
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
              ? "bg-primary text-white"
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
            <LocationSelectDropdown
              value={selectedLocationId}
              onChange={onLocationSelect}
              options={locations}
              disabled={locationsLoading}
              loading={locationsLoading}
              loadingText="Loading locations..."
              placeholder="Select a location"
            />
          </div>
        </>
      ) : (
        <>
          {/* Create New Location Form */}
          <LocationFormFields
            name={locationName}
            address={locationAddress}
            city={locationCity}
            zip={locationZip}
            country={locationCountry}
            onNameChange={onLocationNameChange}
            onAddressChange={onLocationAddressChange}
            onCityChange={onLocationCityChange}
            onZipChange={onLocationZipChange}
            onCountryChange={onLocationCountryChange}
            onSubmit={handleCreateLocation}
            submitLabel="Save Location"
            pendingLabel="Creating..."
            isSubmitting={createLocationMutationIsPending}
            validationMessage={validationError}
            topSlot={
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Search Location
                </label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => onLocationSearch(e.target.value)}
                  placeholder="Search address, place, business..."
                  className="w-full px-4 py-3 input-event-form"
                />

                {isSearching && (
                  <p className="mt-2 text-xs text-gray-400">Searching...</p>
                )}

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
            }
          />
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
