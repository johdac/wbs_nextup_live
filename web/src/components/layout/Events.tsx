import EventCard from "./EventCard";
import { useState } from "react";
import DateTimeInput from "./DateTimeInput";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { Pagination } from "@mui/material";
import type { PlaylistItem } from "../../features/player/playerTypes";
import { mergeMusicResources } from "../../features/player/utils/mergeMusicResources";
import { PlayerTransports } from "../../features/player/PlayerTransports";

const ROOT_ITEMS_PER_PAGE = 10;
const EVENTS_ITEMS_PER_PAGE = 20;

const EventList = ({ favorited }: { favorited?: boolean }) => {
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [radius, setRadius] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEventRoute = pathname === "/events";

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
      genre,
      location,
      dateTime?.toISOString(),
    ],
    queryFn: () =>
      eventsService.fetchEventsList(currentPage, {
        limit: itemsPerPage,
        genres: genre ? [genre] : undefined,
        search: location || undefined,
        startAfter: dateTime ? dateTime.toISOString() : undefined,
        isFavorite: favorited ? true : undefined,
      }),
    retry: 1,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (genre) params.append("genre", genre);
    if (location) params.append("location", location);

    if (isEventRoute) {
      params.set("page", "1");
      params.set("limit", String(EVENTS_ITEMS_PER_PAGE));
    }

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
    <section className=" ">
      <div className=" py-4 mb-10 ">
        <div
          className=" flex flex-col gap-4
                lg:flex-row lg:items-end lg:gap-4"
        >
          {/* Date / Time Picker */}
          <div className="w-full lg:flex-1 mui-white-outline">
            <DateTimeInput value={dateTime} onChange={setDateTime} />
          </div>

          {/* Location + Radius */}
          <div className="w-full lg:flex-[1.5] flex gap-2">
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              className="mui-white-outline"
            />
            <TextField
              label="Radius"
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
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
              // className="bg-purple w-full py-2.5 md:py-3 rounded-md text-lg text-white font-bold active:bg-orange lg:hover:bg-orange transition-all cursor-pointer"
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
            {eventsList.map((event: EventListItem, index: number) => {
              return <EventCard key={event.id} event={event} index={index} />;
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
                const params = new URLSearchParams();
                if (genre) params.append("genre", genre);
                if (location) params.append("location", location);
                params.set("page", "1");
                params.set("limit", String(EVENTS_ITEMS_PER_PAGE));
                navigate(`/events?${params.toString()}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="btn-default px-8 py-3"
            >
              Dicover more Events
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default EventList;
