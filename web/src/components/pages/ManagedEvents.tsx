import EventCardEdit from "../layout/EventCardEdit";
import { useQuery } from "@tanstack/react-query";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { useAuth } from "../../context/AuthContext";

const EVENT_FALLBACK_IMAGES = ["/1.avif", "/2.avif", "/3.avif", "/4.avif", "/5.avif"];

export const ManagedEvents = () => {
  const { user } = useAuth();
  const organizerId = user?._id;

  const {
    data: eventsList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events-list", organizerId],
    queryFn: () => eventsService.fetchEventsList(1, organizerId ? { organizerId } : undefined),
    retry: 1,
  });

  return (
    <>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2">Managed Events</h1>
            <p className="text-gray-400">Edit your saved events</p>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            {isLoading && <div className="py-12 text-center font-display text-lg text-white">Loading events...</div>}
            {!isLoading && eventsList.length > 0
              ? eventsList.map((event: EventListItem, index: number) => {
                  const eventWithImage = {
                    ...event,
                    coverImage: event.coverImage || EVENT_FALLBACK_IMAGES[index % EVENT_FALLBACK_IMAGES.length],
                  };
                  return <EventCardEdit key={event.id} event={eventWithImage} index={index} />;
                })
              : !isLoading && (
                  <p className="py-12 text-center font-display text-lg text-white">
                    {error ? "Failed to load events from server" : "No events found"}
                  </p>
                )}
          </div>
        </div>
      </div>
    </>
  );
};
