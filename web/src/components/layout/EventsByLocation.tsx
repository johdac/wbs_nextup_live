import EventCard from "./EventCard";
import { useQuery } from "@tanstack/react-query";
import { eventsService, type EventListItem } from "../../services/eventsApi";

export const EventByLocation = ({ locationId }: { locationId: string | any }) => {
  const {
    data: eventsList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events-list", locationId],
    queryFn: () => eventsService.fetchEventsList(1, locationId ? { locationId } : undefined),
    retry: 1,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <section className=" ">
        <h2 className="mb-2 font-display text-2xl font-bold tracking-wider text-foreground sm:text-3xl">
          All <span className="neon-gradient-text">Upcoming</span> Events At Location
        </h2>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          {isLoading && <div className="py-12 text-center font-display text-lg text-white">Loading events...</div>}
          {!isLoading && eventsList.length > 0
            ? eventsList.map((event: EventListItem, index: number) => {
                return <EventCard key={event.id} event={event} index={index} />;
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
