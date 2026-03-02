import EventCard from "./EventCard";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { mockEvents } from "../../data/MockData";

const EventList = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return mockEvents;
    }

    const q = search.toLowerCase().trim();
    return mockEvents.filter((event) => {
      return (
        event.title.toLowerCase().includes(q) ||
        event.genre.toLowerCase().includes(q)
      );
    });
  }, [search]);

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

        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray py-4 pl-12 pr-4"
          />
        </div>

        <div className="flex flex-col gap-4">
          {filtered.length > 0 ? (
            filtered.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="py-12 text-center font-display text-lg text-white">
              No events found matching
              {/* <span className="text-purple">{search}</span>" */}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventList;
