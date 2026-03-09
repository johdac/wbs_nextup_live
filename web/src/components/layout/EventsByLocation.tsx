import EventCard from "./EventCard";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { eventsService, type EventListItem } from "../../services/eventsApi";

const EVENT_FALLBACK_IMAGES = ["/1.avif", "/2.avif", "/3.avif", "/4.avif", "/5.avif"];

export const EventByLocation = ({ locationId }: { locationId: string }) => {
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [radius, setRadius] = useState(1);
  const [searchParams] = useSearchParams();
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const navigate = useNavigate();

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
    queryKey: ["events-list", locationId],
    queryFn: () => eventsService.fetchEventsList(1, locationId ? { locationId } : undefined),
    retry: 1,
  });
  const filtered = useMemo(() => {
    let result = eventsList;
    if (genre) {
      const selectedGenre = genre.toLowerCase();
      result = result.filter((event: EventListItem) => event.genre.toLowerCase() === selectedGenre);
    }
    return result;
  }, [eventsList, genre]);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className=" ">
        <h2 className="mb-2 font-display text-2xl font-bold tracking-wider text-foreground sm:text-3xl">
          All <span className="neon-gradient-text">Upcoming</span> Events At Location
        </h2>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          {isLoading && <div className="py-12 text-center font-display text-lg text-white">Loading events...</div>}
          {!isLoading && filtered.length > 0
            ? filtered.map((event: EventListItem, index: number) => {
                const eventWithImage = {
                  ...event,
                  coverImage: event.coverImage || EVENT_FALLBACK_IMAGES[index % EVENT_FALLBACK_IMAGES.length],
                };

                return <EventCard key={event.id} event={eventWithImage} index={index} />;
              })
            : !isLoading && (
                <p className="py-12 text-center font-display text-lg text-white">
                  {error ? "Failed to load events from server" : "No events found"}
                </p>
              )}
        </div>
      </section>
    </div>
  );
};
