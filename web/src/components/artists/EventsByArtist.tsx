import EventCard from "../events/EventCard";
import { useQuery } from "@tanstack/react-query";
import { eventsService, type EventListItem } from "../../services/eventsApi";

export const EventByArtist = ({ artistId }: { artistId: string | any }) => {
  const {
    data: eventsList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events-list", artistId],
    queryFn: () =>
      eventsService.fetchEventsList(1, artistId ? { artistId } : undefined),
    retry: 1,
  });

  return (
    <div className="">
      <h2 className="mb-2 font-display text-2xl font-bold tracking-wider text-foreground sm:text-3xl">
        All <span className="neon-gradient-text">Upcoming</span> Events By
        Artist
      </h2>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {isLoading && (
          <div className="py-12 text-center font-display text-lg text-white">
            Loading events...
          </div>
        )}
        {!isLoading && eventsList.length > 0
          ? eventsList.map((event: EventListItem) => {
              return <EventCard key={event.id} event={event} />;
            })
          : !isLoading && (
              <p className="py-12 text-center font-display text-lg text-white">
                {error
                  ? "Failed to load events from server"
                  : "No events found"}
              </p>
            )}
      </div>
    </div>
  );
};
