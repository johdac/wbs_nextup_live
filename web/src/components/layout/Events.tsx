import EventCard from "./EventCard";
import { useEffect, useMemo, useState } from "react";
import DateTimeInput from "./DateTimeInput";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
// import { Search } from "lucide-react";
import { mockEvents } from "../../data/MockData";
import { useNavigate, useSearchParams } from "react-router";

const EventList = () => {
  const [search, setSearch] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [radius, setRadius] = useState(1);
  const [searchParams] = useSearchParams();
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const navigate = useNavigate();

  const genres = [
    "Rock",
    "Techno",
    "Jazz",
    "Hip-Hop",
    "Indie",
    "Electronic",
    "Pop",
    "Classical",
    "Folk",
    "Reggae",
  ];

  useEffect(() => {
    setGenre(searchParams.get("genre") || "");
    setLocation(searchParams.get("location") || "");
  }, [searchParams]);

  const handleSearch = () => {
    // Construct the URL with query parameters
    const params = new URLSearchParams();
    if (genre) params.append("genre", genre);
    if (location) params.append("location", location);
    // Add other filters as needed

    navigate(`/events?${params.toString()}`);
  };

  const filtered = useMemo(() => {
    let events = mockEvents;
    const q = search.toLowerCase().trim();
    if (q) {
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(q) ||
          event.genre.toLowerCase().includes(q),
      );
    }
    if (genre) {
      events = events.filter((event) => event.genre === genre);
    }
    return events;
  }, [search, genre]);

  return (
    <section id="events" className="relative py-20">
      <div className="absolute inset-0 retro-stripe opacity-30" />
      <div className="container relative mx-auto px-4">
        <h2 className="mb-2 font-display text-2xl font-bold tracking-wider text-foreground sm:text-3xl">
          All <span className="neon-gradient-text">Upcoming</span> Events
        </h2>
        <p className="mb-6 font-body text-sm text-muted-foreground">
          Your next unforgettable night awaits
        </p>
        <div className="relative mb-10 flex flex-col gap-4">
          <div className="relative">
            {/* <Search className="absolute text-white left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-white rounded-lg border border-gray py-4 pl-12 pr-4"
            /> */}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 mui-white-outline">
              <DateTimeInput value={dateTime} onChange={setDateTime} />
            </div>
            <div className="flex-1 flex gap-2">
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
                label="Radius (km)"
                type="number"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                size="small"
                inputProps={{ min: 1, max: 100 }}
                className="mui-white-outline"
                sx={{ width: 150 }}
              />
            </div>
            <div className="flex-1">
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
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="flex-1">
              <button
                onClick={handleSearch}
                className="bg-purple w-100 py-3 rounded-md text-lg text-white font-bold hover:bg-orange transition-all"
              >
                Find Events
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {filtered.length > 0 ? (
            filtered.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))
          ) : (
            <p className="py-12 text-center font-display text-lg text-white">
              No events found matching
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventList;
