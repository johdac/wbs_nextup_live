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
    <section className=" py-20">
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
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Search Button */}
          <div className="w-full lg:w-auto lg:min-w-[160px]">
            <button
              onClick={handleSearch}
              className="bg-purple w-full py-2.5 md:py-3 rounded-md text-lg text-white font-bold active:bg-orange lg:hover:bg-orange transition-all cursor-pointer"
            >
              Find Events
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
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
    </section>
  );
};

export default EventList;

// import EventCard from "./EventCard";
// import { useEffect, useState } from "react";
// import DateTimeInput from "./DateTimeInput";
// import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";
// import { useNavigate, useSearchParams, useLocation } from "react-router";
// import { useQuery } from "@tanstack/react-query";
// import { eventsService } from "../../services/eventsApi";

// const EventList = () => {
//   const [search, setSearch] = useState("");
//   const [dateTime, setDateTime] = useState<Date | null>(null);
//   const [radius, setRadius] = useState(1);
//   const [searchParams] = useSearchParams();
//   const [genre, setGenre] = useState(searchParams.get("genre") || "");
//   const [location, setLocation] = useState(searchParams.get("location") || "");
//   const [page, setPage] = useState(1);

//   const navigate = useNavigate();
//   const location_path = useLocation();
//   const isLandingPage = location_path.pathname === "/";
//   const PAGE_SIZE = isLandingPage ? 7 : 10;

//   const genres = [
//     "Rock",
//     "Techno",
//     "Jazz",
//     "Hip-Hop",
//     "Indie",
//     "Electronic",
//     "Pop",
//     "Classical",
//     "Folk",
//     "Reggae",
//   ];

//   // Fetch events from API
//   const { data: eventsList } = useQuery({
//     queryKey: ["events-list", page, isLandingPage],
//     queryFn: () => eventsService.fetchEventsList(page),
//     enabled: !isLandingPage || page === 1, // On landing, only fetch page 1
//   });

//   useEffect(() => {
//     setGenre(searchParams.get("genre") || "");
//     setLocation(searchParams.get("location") || "");
//   }, [searchParams]);

//   const handleSearch = () => {
//     // Reset to page 1 when searching
//     setPage(1);
//     // Navigate to events page with filters
//     const params = new URLSearchParams();
//     if (genre) params.append("genre", genre);
//     if (location) params.append("location", location);
//     if (search) params.append("search", search);

//     navigate(`/events?${params.toString()}`);
//   };

//   // On landing page, show only first 7 items from API
//   const displayedEvents = isLandingPage ? eventsList?.slice(0, 7) : eventsList;

//   return (
//     <section className=" py-20">
//       <h2 className="mb-2 font-display text-2xl font-bold tracking-wider text-foreground sm:text-3xl">
//         All <span className="neon-gradient-text">Upcoming</span> Events
//       </h2>
//       <p className="mb-6 font-body text-sm text-white">
//         Your next unforgettable night awaits
//       </p>

//       {/* Search Bar - Only show on Events page */}
//       {!isLandingPage && (
//         <div
//           style={{ backgroundImage: 'url("/bg.jpg")' }}
//           className="sticky top-24 z-40  py-4 mb-10 "
//         >
//           <div
//             className=" flex flex-col gap-4
//                   lg:flex-row lg:items-end lg:gap-4"
//           >
//             {/* Date / Time Picker */}
//             <div className="w-full lg:flex-1 mui-white-outline">
//               <DateTimeInput value={dateTime} onChange={setDateTime} />
//             </div>

//             {/* Location + Radius */}
//             <div className="w-full lg:flex-[1.5] flex gap-2">
//               <TextField
//                 label="Location"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 fullWidth
//                 size="small"
//                 variant="outlined"
//                 className="mui-white-outline"
//               />
//               <TextField
//                 label="Radius"
//                 type="number"
//                 value={radius}
//                 onChange={(e) => setRadius(Number(e.target.value))}
//                 size="small"
//                 inputProps={{ min: 1, max: 100 }}
//                 className="mui-white-outline"
//                 sx={{ width: { xs: 100, sm: 150 } }}
//               />
//             </div>

//             {/* Genre */}
//             <div className="w-full lg:flex-1">
//               <TextField
//                 select
//                 label="Genre"
//                 value={genre}
//                 onChange={(e) => setGenre(e.target.value)}
//                 fullWidth
//                 size="small"
//                 variant="outlined"
//                 className="mui-white-outline"
//               >
//                 <MenuItem value="">All Genres</MenuItem>
//                 {genres.map((g) => (
//                   <MenuItem key={g} value={g}>
//                     {g}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </div>

//             {/* Search Button */}
//             <div className="w-full lg:w-auto lg:min-w-[160px]">
//               <button
//                 onClick={handleSearch}
//                 className="bg-purple w-full py-2.5 md:py-3 rounded-md text-lg text-white font-bold active:bg-orange lg:hover:bg-orange transition-all cursor-pointer"
//               >
//                 Find Events
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Events Grid */}
//       <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
//         {displayedEvents && displayedEvents.length > 0 ? (
//           displayedEvents.map((event, index) => (
//             <EventCard key={event.id} event={event} index={index} />
//           ))
//         ) : (
//           <p className="py-12 text-center font-display text-lg text-white">
//             No events found
//           </p>
//         )}
//       </div>

//       {/* Pagination - Only show on Events page */}
//       {!isLandingPage && (
//         <div className="mt-8 flex justify-center gap-3">
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page === 1}
//             className="px-4 py-2 bg-purple text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange transition-all"
//           >
//             Previous
//           </button>
//           <span className="flex items-center text-sm text-white">
//             Page {page}
//           </span>
//           <button
//             onClick={() => setPage((p) => p + 1)}
//             disabled={!eventsList || eventsList.length < PAGE_SIZE}
//             className="px-4 py-2 bg-purple text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange transition-all"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </section>
//   );
// };

// export default EventList;
