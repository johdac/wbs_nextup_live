import EventCard from "../events/EventCard";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { Pagination } from "@mui/material";
import type { PlaylistItem } from "../../features/player/playerTypes";
import { mergeMusicResources } from "../../features/player/utils/mergeMusicResources";
import { PlayerTransports } from "../../features/player/PlayerTransports";
import DateTimeInput from "../layout/DateTimeInput";
import LocationSearch, {
  type LocationSearchResult,
} from "../ui/LocationSearch";

const ROOT_ITEMS_PER_PAGE = 10;
const EVENTS_ITEMS_PER_PAGE = 20;

const EventList = ({ favorited }: { favorited?: boolean }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStartAfter = searchParams.get("startAfter");
  const initialRadiusMeters = Number(searchParams.get("radius") || "0");
  const initialLat = searchParams.get("lat");
  const initialLng = searchParams.get("lng");
  const [defaultStartDate] = useState<Date>(() =>
    initialStartAfter ? new Date(initialStartAfter) : new Date(),
  );

  const [dateTime, setDateTime] = useState<Date | null>(defaultStartDate);
  const [radius, setRadius] = useState(
    Number.isFinite(initialRadiusMeters) && initialRadiusMeters > 0
      ? initialRadiusMeters / 1000
      : 1,
  );
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [selectedLat, setSelectedLat] = useState<number | null>(
    initialLat ? Number(initialLat) : null,
  );
  const [selectedLng, setSelectedLng] = useState<number | null>(
    initialLng ? Number(initialLng) : null,
  );

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEventRoute = pathname === "/events";
  const radiusInMeters = Math.round(radius * 1000);
  const appliedGenre = searchParams.get("genre") || "";
  const appliedStartAfter =
    searchParams.get("startAfter") || defaultStartDate.toISOString();
  const appliedLat = searchParams.get("lat");
  const appliedLng = searchParams.get("lng");
  const appliedRadiusMeters = Number(searchParams.get("radius") || "0");

  const pageParam = Number(searchParams.get("page") || "1");
  const limitParam = Number(
    searchParams.get("limit") || String(EVENTS_ITEMS_PER_PAGE),
  );

  const currentPage =
    isEventRoute && Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const itemsPerPage =
    isEventRoute && Number.isFinite(limitParam) && limitParam > 0
      ? limitParam
      : isEventRoute
        ? EVENTS_ITEMS_PER_PAGE
        : ROOT_ITEMS_PER_PAGE;

  const genres = [
    { value: "classical", label: "Classical" },
    { value: "electronic", label: "Electronic" },
    { value: "hiphop", label: "Hip-Hop" },
    { value: "jazz", label: "Jazz" },
    { value: "rock", label: "Rock" },
    { value: "world", label: "World" },
  ];

  const {
    data: eventsList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "events",
      "list",
      currentPage,
      itemsPerPage,
      appliedGenre,
      appliedLat,
      appliedLng,
      appliedRadiusMeters,
      appliedStartAfter,
      favorited,
    ],
    queryFn: () =>
      eventsService.fetchEventsList(currentPage, {
        limit: itemsPerPage,
        genres: appliedGenre ? [appliedGenre] : undefined,
        lat: appliedLat ? Number(appliedLat) : undefined,
        lng: appliedLng ? Number(appliedLng) : undefined,
        radius:
          appliedLat && appliedLng && appliedRadiusMeters > 0
            ? appliedRadiusMeters
            : undefined,
        startAfter: appliedStartAfter,
        isFavorite: favorited ? true : undefined,
      }),
    retry: 1,
  });

  const handleLocationSelect = ({
    displayName,
    lat,
    lng,
  }: LocationSearchResult) => {
    setLocation(displayName);
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  const handleLocationClear = () => {
    setLocation("");
    setSelectedLat(null);
    setSelectedLng(null);
    setRadius(1);
    // Remove location/lat/lng/radius from URL params and trigger search for all events
    const params = new URLSearchParams(searchParams);
    params.delete("location");
    params.delete("lat");
    params.delete("lng");
    params.delete("radius");
    params.set("page", "1");
    setSearchParams(params);
  };

  const buildParams = () => {
    const params = new URLSearchParams();
    const normalizedLocation = location.trim();
    if (genre) params.append("genre", genre);
    if (normalizedLocation) params.append("location", normalizedLocation);
    if (dateTime) params.set("startAfter", dateTime.toISOString());
    if (normalizedLocation && selectedLat !== null) {
      params.set("lat", String(selectedLat));
    }
    if (normalizedLocation && selectedLng !== null) {
      params.set("lng", String(selectedLng));
    }
    if (
      normalizedLocation &&
      selectedLat !== null &&
      selectedLng !== null &&
      Number.isFinite(radiusInMeters) &&
      radiusInMeters > 0
    ) {
      params.set("radius", String(radiusInMeters));
    }

    return params;
  };

  const handleSearch = () => {
    const params = buildParams();

    params.set("page", "1");
    params.set(
      "limit",
      String(isEventRoute ? EVENTS_ITEMS_PER_PAGE : ROOT_ITEMS_PER_PAGE),
    );

    setSearchParams(params);
  };

  const updatePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    params.set("limit", String(EVENTS_ITEMS_PER_PAGE));
    setSearchParams(params);
  };

  const mergedMusicResources: PlaylistItem[] = mergeMusicResources(eventsList);

  return (
    <section>
      <div className=" py-4 mb-10 ">
        <div className=" flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-4">
          {/* Date / Time Picker */}
          <div className="w-full lg:flex-1 mui-white-outline">
            <DateTimeInput value={dateTime} onChange={setDateTime} />
          </div>

          {/* Location + Radius */}
          <div className="w-full lg:flex-[1.5] flex gap-2">
            <LocationSearch
              value={location}
              onChange={(nextLocation) => {
                setLocation(nextLocation);
                if (!nextLocation.trim()) {
                  setSelectedLat(null);
                  setSelectedLng(null);
                }
              }}
              onSelect={handleLocationSelect}
              onClear={handleLocationClear}
            />
            <TextField
              label="Radius (km)"
              type="number"
              value={radius}
              onChange={(e) =>
                setRadius(Math.max(1, Number(e.target.value) || 1))
              }
              size="small"
              inputProps={{ min: 1, max: 100 }}
              className="mui-white-outline"
              sx={{ width: { xs: 100, sm: 150 } }} // Responsive width
            />
          </div>

          {/* Genre */}
          <div className="w-full lg:flex-1">
            <TextField
              select
              label="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              className="mui-white-outline"
            >
              <MenuItem value="">All Genres</MenuItem>
              {genres.map((g) => (
                <MenuItem key={g.value} value={g.value}>
                  {g.label}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Search Button */}
          <div className="w-full lg:w-auto lg:min-w-40">
            <button
              onClick={handleSearch}
              className="btn-default w-full py-4"
              disabled={
                Boolean(location) &&
                (selectedLat === null || selectedLng === null)
              }
            >
              Find Events
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {isLoading && (
          <div className="py-12 text-center font-display text-lg text-white">
            Loading events...
          </div>
        )}
        {!isLoading && eventsList.length > 0 ? (
          <>
            <div>
              All songs <PlayerTransports resources={mergedMusicResources} />
            </div>
            {eventsList.map((event: EventListItem) => {
              return <EventCard key={event.id} event={event} />;
            })}
          </>
        ) : (
          !isLoading && (
            <p className="py-12 text-center font-display text-lg text-white">
              {error ? "Failed to load events from server" : "No events found"}
            </p>
          )
        )}
      </div>

      {/* Pagination or Load More Button */}
      {!isLoading && eventsList.length > 0 && (
        <div className="mt-12 flex justify-center items-center">
          {isEventRoute ? (
            <Pagination
              className="pagination-style"
              count={currentPage + (eventsList.length === itemsPerPage ? 1 : 0)}
              page={currentPage}
              onChange={(_, page) => {
                updatePage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              size="large"
            />
          ) : (
            <button
              onClick={() => {
                const params = buildParams();
                params.set("page", "1");
                params.set("limit", String(EVENTS_ITEMS_PER_PAGE));
                navigate(`/events?${params.toString()}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="btn-default px-8 py-3"
            >
              Discover more Events
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default EventList;
