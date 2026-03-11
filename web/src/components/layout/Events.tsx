import EventCard from "./EventCard";
import { useState } from "react";
import DateTimeInput from "./DateTimeInput";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { Pagination } from "@mui/material";

const EVENT_FALLBACK_IMAGES = [
  "/1.avif",
  "/2.avif",
  "/3.avif",
  "/4.avif",
  "/5.avif",
];
const ITEMS_PER_PAGE = 20;

const EventList = () => {
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [radius, setRadius] = useState(1);
  const [searchParams] = useSearchParams();
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEventRoute = pathname === "/events";

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
      "events-list",
      currentPage,
      genre,
      location,
      dateTime?.toISOString(),
    ],
    queryFn: () =>
      eventsService.fetchEventsList(currentPage, {
        limit: ITEMS_PER_PAGE,
        genres: genre ? [genre] : undefined,
        search: location || undefined,
        startAfter: dateTime ? dateTime.toISOString() : undefined,
      }),
    retry: 1,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (genre) params.append("genre", genre);
    if (location) params.append("location", location);

    setCurrentPage(1);
    navigate(`/events?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className=" ">
        <h2 className="mb-2 font-display text-2xl font-bold tracking-wider text-foreground sm:text-3xl">
          All <span className="neon-gradient-text">Upcoming</span> Events
        </h2>
        <p className="mb-6 font-body text-sm text-white">
          Your next unforgettable night awaits
        </p>

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
          {!isLoading && eventsList.length > 0
            ? eventsList.map((event: EventListItem, index: number) => {
                const eventWithImage = {
                  ...event,
                  coverImage:
                    event.coverImage ||
                    EVENT_FALLBACK_IMAGES[index % EVENT_FALLBACK_IMAGES.length],
                };

                return (
                  <EventCard
                    key={event.id}
                    event={eventWithImage}
                    index={index}
                  />
                );
              })
            : !isLoading && (
                <p className="py-12 text-center font-display text-lg text-white">
                  {error
                    ? "Failed to load events from server"
                    : "No events found"}
                </p>
              )}
        </div>

        {/* Pagination or Load More Button */}
        {!isLoading && eventsList.length > 0 && (
          <div className="mt-12 flex justify-center items-center">
            {isEventRoute ? (
              <Pagination
                className="pagination-style"
                count={
                  currentPage + (eventsList.length === ITEMS_PER_PAGE ? 1 : 0)
                }
                page={currentPage}
                onChange={(_, page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                size="large"
              />
            ) : (
              <button
                onClick={() => navigate("/events")}
                className="btn-default px-8 py-3"
              >
                Load More Events
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default EventList;
