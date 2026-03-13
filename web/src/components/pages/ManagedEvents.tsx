import EventPreviewCard from "../events/EventPreviewCard";
import { useQuery } from "@tanstack/react-query";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router";

export const ManagedEvents = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const organizerId = user?._id;
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    data: eventsList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events-list", organizerId],
    queryFn: () => eventsService.fetchEventsList(1, organizerId ? { organizerId } : undefined),
    retry: 1,
  });

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await eventsService.deleteEvent(itemToDelete);
      navigate("/managed-events");
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

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
              ? eventsList.map((event: EventListItem) => {
                  return (
                    <EventPreviewCard
                      key={event.id}
                      event={event}
                      handleDelete={handleDelete}
                      showModal={showModal}
                      setItemToDelete={setItemToDelete}
                      setShowModal={setShowModal}
                    />
                  );
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
